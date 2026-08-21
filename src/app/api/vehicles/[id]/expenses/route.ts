import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await getTenantContext();
    const { id } = await params;
    const body = await req.json();
    const { category, description, amount, vendor, receiptUrl, date } = body;

    if (!category || !description || amount === undefined) {
      return NextResponse.json(
        { error: 'Category, description, and amount are required.' },
        { status: 400 }
      );
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle || vehicle.organizationId !== tenant.organizationId) {
      return NextResponse.json({ error: 'Vehicle not found.' }, { status: 404 });
    }

    const parsedAmount = Number(amount) || 0;

    // 1. Create expense record
    const expense = await prisma.vehicleExpense.create({
      data: {
        organizationId: tenant.organizationId,
        vehicleId: id,
        category,
        description,
        amount: parsedAmount,
        vendor: vendor || null,
        receiptUrl: receiptUrl || null,
        date: date ? new Date(date) : new Date(),
      },
    });

    // 2. Re-calculate totalCostBasis
    const allExpenses = await prisma.vehicleExpense.findMany({
      where: { vehicleId: id },
    });
    const totalExpenseSum = allExpenses.reduce((sum, e) => sum + e.amount, 0);
    const updatedTotalCost = (vehicle.purchasePrice || 0) + totalExpenseSum;

    const updatedVehicle = await prisma.vehicle.update({
      where: { id },
      data: { totalCostBasis: updatedTotalCost },
    });

    return NextResponse.json({
      success: true,
      expense,
      totalCostBasis: updatedTotalCost,
      vehicle: updatedVehicle,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
