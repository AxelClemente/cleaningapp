import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Not authenticated or user email not found" }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany();

    const formattedOrders = await Promise.all(orders.map(async (order) => {
      const user = await prisma.user.findUnique({
        where: { id: order.userId },
      });

      return {
        id: order.id,
        userId: order.userId, // Add this line
        userName: user?.name || 'Unknown',
        calendarData: order.calendarData,
        houseType: order.houseType,
        serviceType: order.serviceType,
        location: order.location,
        price: order.price,
        status: order.status,
        avatarUrl: user?.image || '',
        entryMethod: order.entryMethod,
        comment: order.comment,
      };
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Error fetching orders', details: errorMessage }, { status: 500 });
  }
}

// Existing POST function
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received body:", body);

    const { userEmail, houseType, calendarData, location, phoneNumber, entryMethod, comment, price, status, serviceType } = body;

    // Verifica que serviceType sea un string
    if (typeof serviceType !== 'string') {
      return NextResponse.json({ error: 'serviceType must be a string' }, { status: 400 });
    }

    // Encuentra el usuario por email
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Crea la orden
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        houseType,
        serviceType, // Ahora estamos seguros de que es un string
        calendarData: typeof calendarData === 'string' ? calendarData : JSON.stringify(calendarData),
        location,
        phoneNumber,
        entryMethod,
        comment,
        price,
        status,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order', details: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: "orderId and status are required" }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order', details: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const deletedOrder = await prisma.order.delete({
      where: { id: orderId },
    });

    if (!deletedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order successfully deleted" });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order', details: error.message }, { status: 500 });
  }
}