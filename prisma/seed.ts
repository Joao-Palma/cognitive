/**
 * Seed da base de dados: insere as cadeiras que têm guias interativos (por agora Álgebra Linear),
 * sem precisar de rede. Idempotente: pode correr várias vezes.
 *
 * Usa o mesmo fenixId que o scraper, por isso `npm run scrape` depois atualiza estes registos
 * em vez de os duplicar. Pesos/dificuldades ajustados à mão não são sobrescritos.
 *
 * Corre automaticamente em `prisma migrate dev` (BD nova) e `prisma migrate reset`,
 * ou à mão com `npx prisma db seed` / `npm run db:setup`.
 */
import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";
import { GUIDE_INDEX } from "../src/guides/index";

interface SeedCourse {
  fenixId: string;
  acronym: string;
  name: string;
  nameEn?: string;
  ects: number;
  semester: number | null;
  programRaw: string | null;
  topics: { order: number; title: string; titleEn?: string; weight: number; difficulty: number }[];
}

const prisma = new PrismaClient();
const DATA_DIR = path.join(__dirname, "seed-data");

async function seedCourse(c: SeedCourse) {
  // Os guias estão ligados aos tópicos pela ordem: garantir que nenhum fica sem tópico
  const missing = (GUIDE_INDEX[c.acronym] ?? []).filter((o) => !c.topics.some((t) => t.order === o));
  if (missing.length) throw new Error(`${c.acronym}: há guias para tópicos inexistentes (${missing.join(", ")})`);

  const course = await prisma.course.upsert({
    where: { fenixId: c.fenixId },
    create: { fenixId: c.fenixId, acronym: c.acronym, name: c.name, nameEn: c.nameEn, ects: c.ects, semester: c.semester, programRaw: c.programRaw },
    update: { acronym: c.acronym, name: c.name, nameEn: c.nameEn, ects: c.ects, semester: c.semester, programRaw: c.programRaw },
  });
  for (const t of c.topics) {
    await prisma.topic.upsert({
      where: { courseId_order: { courseId: course.id, order: t.order } },
      create: { courseId: course.id, order: t.order, title: t.title, titleEn: t.titleEn, weight: t.weight, difficulty: t.difficulty },
      update: { title: t.title, titleEn: t.titleEn },
    });
  }
  const guides = GUIDE_INDEX[c.acronym]?.length ?? 0;
  console.log(`  ✔ ${c.acronym} — ${c.name}: ${c.topics.length} tópicos, ${guides} guias interativos`);
}

async function main() {
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json")).sort();
  console.log(`🌱 Seed: ${files.length} cadeira(s)`);
  for (const f of files) await seedCourse(JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), "utf8")));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
