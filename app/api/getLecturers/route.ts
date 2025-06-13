import { prisma } from "@/lib/db/prisma";
export async function GET() {
  const data = await prisma.lecturer.findMany({
    include: {
      courses: true,
      results: true,
      user: true
    }
  });

  console.log(data);

  return Response.json({ data });
}
