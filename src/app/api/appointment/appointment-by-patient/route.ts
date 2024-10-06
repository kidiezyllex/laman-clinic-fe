import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import prismadb from "../../../../../lib/prismadb";

// CREATE (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const appointment = await prismadb.appointmentByPatient.create({
      data: {
        ...body,
      },
    });
    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Failed to create appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}

// UPDATE (PUT)
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updatedAppointment = await prismadb.appointmentByPatient.update({
      where: { id },
      data: {
        appointmentDateByPatient: new Date(body.appointmentDateByPatient),
        specialization: body.specialization,
        fullName: body.fullName,
        dateOfBirth: new Date(body.dateOfBirth),
        gender: body.gender,
        address: body.address,
        phone: body.phone,
        email: body.email,
        medicalHistory: body.medicalHistory,
      },
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error("Failed to update appointment:", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prismadb.appointmentByPatient.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Appointment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete appointment:", error);
    return NextResponse.json(
      { error: "Failed to delete appointment" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      return await getSingleAppointment(id);
    } else {
      return await getAppointmentsList();
    }
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

async function getSingleAppointment(id: string) {
  const appointment = await prismadb.appointmentByPatient.findUnique({
    where: { id },
  });

  if (!appointment) {
    return NextResponse.json(
      { error: "Appointment not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(appointment);
}
async function getAppointmentsList() {
  const appointments = await prismadb.appointmentByPatient.findMany();
  return NextResponse.json(appointments);
}
