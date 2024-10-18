import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { PrismaClient } from '@prisma/client';
import { authOptions } from "../../../pages/api/auth/[...nextauth]";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await req.json();
  const { propertyName, propertyType, location, imageUrl, entryMethod, lockboxPass, comment } = body;

  try {
    const property = await prisma.property.create({
      data: {
        userId: session.user.id,
        propertyName,
        propertyType,
        location,
        imageUrl,
        entryMethod,
        lockboxPass,
        comment,
      },
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json({ error: 'Error creating property' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const properties = await prisma.property.findMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Error fetching properties' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
