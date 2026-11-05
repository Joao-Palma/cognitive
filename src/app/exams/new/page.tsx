import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ExamForm } from "@/components/ExamForm";

export default async function NewExamPage() {
  const user = await requireUser();
  const courses = await prisma.course.findMany({
    orderBy: [{ semester: "asc" }, { acronym: "asc" }],
    include: { topics: { orderBy: { order: "asc" }, select: { order: true, title: true } } },
  });
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-2xl font-bold">Novo exame</h1>
      <ExamForm courses={courses} timezone={user.timezone} />
    </div>
  );
}
