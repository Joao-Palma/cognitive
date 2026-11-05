import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { CalendarView } from "@/components/CalendarView";
import { toDayKey } from "@/lib/dates";

export default async function CalendarPage() {
  const user = await requireUser();
  const courses = await prisma.course.findMany({ select: { acronym: true, name: true }, orderBy: { acronym: "asc" } });
  // fim de semestre aproximado: 1.º semestre → 18 dez, 2.º → 31 mai
  const today = toDayKey(new Date(), user.timezone);
  const [y, m] = today.split("-").map(Number);
  const defaultUntil = m >= 9 ? `${y}-12-18` : m <= 1 ? `${y}-01-31` : `${y}-05-31`;
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Calendário</h1>
      <CalendarView timezone={user.timezone} courses={courses} defaultUntil={defaultUntil} />
    </div>
  );
}
