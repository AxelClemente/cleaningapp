import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Not authenticated or user email not found" }, { status: 401 });
  }

  try {
    const body = await request.json();
    console.log('Received body:', body);

    // Buscar el usuario por email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const order = await prisma.order.create({
      data: {
        userId: user.id, // Usar el id del usuario encontrado
        houseType: body.houseType,
        calendarData: body.calendarData,
        location: body.location,
        phoneNumber: body.phoneNumber,
        entryMethod: body.entryMethod,
        comment: body.comment,
        price: body.price,
        status: body.status,
      }
    });

    console.log('Created order:', order);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Error creating order', details: errorMessage }, { status: 500 });
  }
}