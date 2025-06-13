import { prisma } from "@/lib/db/prisma";
export async function GET() {
  const data = await prisma.course.findMany({
    include: {
      lecturer: true,
      results: true,
      enrollments: true
      
    }
  });

  console.log(data);

  return Response.json({ data });
}
