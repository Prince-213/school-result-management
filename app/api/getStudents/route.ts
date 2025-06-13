import { prisma } from "@/lib/db/prisma";
export async function GET() {
  const data = await prisma.student.findMany({
    include: {
      enrollments: true,
      results: true,
      user: true
    }
  });

  console.log(data);

  return Response.json({ data });
}
