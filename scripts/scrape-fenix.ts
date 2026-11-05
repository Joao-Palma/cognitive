/**
 * Importa as cadeiras da LEIC (Alameda + Taguspark) e os respetivos programas
 * a partir da API pública FenixEdu. Idempotente (upsert por fenixId).
 *
 *   npm run scrape            # usa cache local em scripts/.cache
 *   npm run scrape -- --fresh # ignora a cache
 */
import { PrismaClient } from "@prisma/client";
import fs from "node:fs/promises";
import path from "node:path";
import { parseProgram, cleanAcronym } from "../src/lib/parse-program";

const API = "https://fenix.tecnico.ulisboa.pt/api/fenix/v1";
const DEGREES = ["LEIC-A", "LEIC-T"];
const CACHE = path.join(__dirname, ".cache");
const FRESH = process.argv.includes("--fresh");
const prisma = new PrismaClient();

interface FenixDegree { id: string; acronym: string; academicTerm: string; academicTerms: string[] }
interface FenixCourseRef { id: string; acronym: string; name: string; credits: string; academicTerm: string }
interface FenixCourse { competences?: { program?: string }[] }

let lastRequest = 0;
async function get<T>(urlPath: string): Promise<T> {
  const file = path.join(CACHE, urlPath.replace(/[^a-z0-9]+/gi, "_") + ".json");
  if (!FRESH) {
    try {
      return JSON.parse(await fs.readFile(file, "utf8"));
    } catch {}
  }
  const wait = 1000 - (Date.now() - lastRequest); // rate-limit: 1 req/s
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastRequest = Date.now();
  const res = await fetch(API + urlPath, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${urlPath}`);
  const data = await res.json();
  await fs.mkdir(CACHE, { recursive: true });
  await fs.writeFile(file, JSON.stringify(data));
  return data as T;
}

const semesterOf = (term: string) => (term.startsWith("2") ? 2 : 1);

async function main() {
  const degrees = (await get<FenixDegree[]>("/degrees")).filter((d) => DEGREES.includes(d.acronym));
  if (degrees.length === 0) throw new Error("LEIC não encontrada em /degrees");

  // Para cada semestre usa o ano letivo mais recente que já tenha cadeiras publicadas.
  const picked = new Map<string, FenixCourseRef & { semester: number }>(); // chave: nome|semestre
  for (const degree of degrees) {
    const terms = degree.academicTerms.slice(0, 2); // atual + anterior
    const seenSemesters = new Set<number>();
    for (const term of terms) {
      const list = await get<FenixCourseRef[]>(`/degrees/${degree.id}/courses?academicTerm=${term}`);
      const semestersHere = new Set<number>();
      for (const c of list) {
        const semester = semesterOf(c.academicTerm);
        if (seenSemesters.has(semester)) continue; // já temos este semestre num ano mais recente
        semestersHere.add(semester);
        const key = `${c.name}|${semester}`;
        if (!picked.has(key)) picked.set(key, { ...c, semester });
      }
      semestersHere.forEach((s) => seenSemesters.add(s));
    }
  }

  // nomes em inglês (a API aceita lang=en-GB; os programas continuam só em português)
  const nameEn = new Map<string, string>();
  for (const degree of degrees)
    for (const term of degree.academicTerms.slice(0, 2))
      for (const c of await get<FenixCourseRef[]>(`/degrees/${degree.id}/courses?academicTerm=${term}&lang=en-GB`)) nameEn.set(c.id, c.name);

  console.log(`${picked.size} cadeiras encontradas`);
  let withTopics = 0;
  for (const c of picked.values()) {
    const detail = await get<FenixCourse>(`/courses/${c.id}`);
    const programRaw = detail.competences?.map((x) => x.program ?? "").find((p) => p.trim()) ?? "";
    const topics = parseProgram(programRaw);

    const course = await prisma.course.upsert({
      where: { fenixId: c.id },
      create: {
        fenixId: c.id,
        acronym: cleanAcronym(c.acronym, c.name),
        name: c.name,
        nameEn: nameEn.get(c.id) ?? null,
        ects: Number(c.credits) || 6,
        semester: c.semester,
        programRaw,
        lastScrapedAt: new Date(),
      },
      update: { acronym: cleanAcronym(c.acronym, c.name), name: c.name, nameEn: nameEn.get(c.id) ?? null, ects: Number(c.credits) || 6, semester: c.semester, programRaw, lastScrapedAt: new Date() },
      include: { topics: true },
    });

    // Atualiza tópicos sem perder pesos/dificuldades ajustados à mão
    const byOrder = new Map(course.topics.map((t) => [t.order, t]));
    for (const [i, title] of topics.entries()) {
      const order = i + 1;
      const existing = byOrder.get(order);
      if (existing) {
        if (existing.title !== title) await prisma.topic.update({ where: { id: existing.id }, data: { title } });
      } else {
        await prisma.topic.create({ data: { courseId: course.id, order, title } });
      }
    }
    await prisma.topic.deleteMany({ where: { courseId: course.id, order: { gt: topics.length } } });

    if (topics.length) withTopics++;
    else console.warn(`  ⚠ ${c.acronym}: sem programa no Fénix`);
    console.log(`  ${cleanAcronym(c.acronym, c.name).padEnd(8)} S${c.semester}  ${String(topics.length).padStart(2)} tópicos  ${c.name}`);
  }
  console.log(`✔ ${withTopics}/${picked.size} cadeiras com tópicos`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
