import { prisma } from "@/lib/db/prisma";
import { cookies } from "next/headers";

export async function GET() {

  const cookieStore = await cookies()

  const id = cookieStore.get("id")?.value

  const data = await prisma.lecturer.findUnique({
    where: {
      id: id
    },
    include: {
      courses: true,
      results: true,
      
      user: true
    }
  });

  console.log(data);

  return Response.json({ data });
}
