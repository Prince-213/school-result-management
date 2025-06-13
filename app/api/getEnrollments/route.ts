import { prisma } from "@/lib/db/prisma";
export async function GET() {
  const data = await prisma.enrollment.findMany({
    include: {
      student: true,
      result: true,
      course: true
    }
  });

  console.log(data);

  return Response.json({ data });
}
