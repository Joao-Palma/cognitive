import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ExamForm } from "@/components/ExamForm";
import { getT } from "@/i18n/server";
import { courseName, topicTitle } from "@/i18n/core";

export default async function NewExamPage() {
  const user = await requireUser();
  const { lang, t } = await getT();
  const courses = await prisma.course.findMany({
    orderBy: [{ semester: "asc" }, { acronym: "asc" }],
    include: { topics: { orderBy: { order: "asc" }, select: { order: true, title: true, titleEn: true } } },
  });
  const options = courses.map((c) => ({
    id: c.id,
    acronym: c.acronym,
    name: courseName(c, lang),
    semester: c.semester,
    topics: c.topics.map((tp) => ({ order: tp.order, title: topicTitle(tp, lang) })),
  }));
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-2xl font-bold">{t("Novo exame", "New exam")}</h1>
      <ExamForm courses={options} timezone={user.timezone} />
    </div>
  );
}
