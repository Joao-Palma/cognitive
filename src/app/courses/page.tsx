import Link from "next/link";
import { prisma } from "@/lib/db";
import { courseColor } from "@/lib/colors";
import { getT } from "@/i18n/server";
import { courseName } from "@/i18n/core";

export default async function CoursesPage() {
  const { lang, t } = await getT();
  const courses = await prisma.course.findMany({
    orderBy: [{ semester: "asc" }, { acronym: "asc" }],
    include: { _count: { select: { topics: true } } },
  });
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">{t("Cadeiras da LEIC", "LEIC courses")}</h1>
      <p className="mb-6 text-sm text-slate-500">{t("Programas importados do Fénix.", "Syllabi imported from Fénix.")}</p>
      {[1, 2].map((s) => (
        <section key={s} className="mb-6">
          <h2 className="mb-2 font-semibold">{t(`${s}.º semestre`, `Semester ${s}`)}</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {courses.filter((c) => (c.semester ?? 1) === s).map((c) => (
              <Link key={c.id} href={`/courses/${c.id}`} className="card flex items-center gap-3 py-3 hover:shadow">
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: courseColor(c.acronym) }} />
                <div className="min-w-0">
                  <div className="truncate font-medium">{c.acronym} · {courseName(c, lang)}</div>
                  <div className="text-xs text-slate-500">{c.ects} ECTS · {c._count.topics} {t("tópicos", "topics")}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
      {courses.length === 0 && <p className="text-slate-500">{t("Sem cadeiras.", "No courses.")} <code>npm run db:setup</code></p>}
    </div>
  );
}
