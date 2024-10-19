import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  console.log("GET request received in /api/orderRequest");
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const workerId = searchParams.get('workerId');

    let whereClause = {};
    if (userId) {
      whereClause = { ...whereClause, userId };
    }
    if (workerId) {
      whereClause = { ...whereClause, workerId };
    }

    const orderRequests = await prisma.orderRequest.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,  // Add this line
          },
        },
        property: {
          select: {
            propertyName: true,
          },
        },
        worker: {
          select: {
            hourlyRate: true,
          },
        },
      },
    });

    console.log(`Found ${orderRequests.length} order requests`);

    return NextResponse.json(orderRequests);
  } catch (error) {
    console.error('Error fetching order requests:', error);
    return NextResponse.json({ error: 'Failed to fetch order requests', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: Request) {
  console.log("POST request received in /api/orderRequest");
  try {
    const body = await req.json();
    console.log("Received body:", body);

    const {
      userId,
      workerId,
      propertyId,
      propertyType,
      selectedDate,
      serviceDuration,
      pricePerHour,
      totalPrice,
      comment,
      imageUrl,
      entryMethod,
      lockboxPass,
      location
    } = body;

    console.log("Parsed data:", {
      userId,
      workerId,
      propertyId,
      propertyType,
      selectedDate,
      serviceDuration,
      pricePerHour,
      totalPrice,
      comment,
      imageUrl,
      entryMethod,
      lockboxPass,
      location
    });

    const orderRequest = await prisma.orderRequest.create({
      data: {
        user: { connect: { id: userId } },
        worker: { connect: { id: workerId } },
        property: { connect: { id: propertyId } },
        propertyType,
        selectedDate: new Date(selectedDate),
        serviceDuration: parseInt(serviceDuration),
        pricePerHour: parseFloat(pricePerHour),
        totalPrice: parseFloat(totalPrice),
        status: 'pending',
        comment,
        imageUrl,
        entryMethod,
        lockboxPass,
        location,
      },
    });

    console.log("OrderRequest created:", orderRequest);

    return NextResponse.json(orderRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating order request:', error);
    return NextResponse.json({ error: 'Failed to create order request', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
