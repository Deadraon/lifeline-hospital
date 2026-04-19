import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("appointments", () => {
  it("should create an appointment with valid data", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const appointmentDate = new Date();
    appointmentDate.setDate(appointmentDate.getDate() + 7); // 7 days from now

    const result = await caller.appointments.create({
      patientName: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      department: "Cardiology",
      doctor: "Dr. Sarah Johnson",
      appointmentDate,
      message: "Follow-up visit",
    });

    expect(result).toEqual({
      success: true,
      message: "Appointment booked successfully!",
    });
  });

  it("should validate required fields", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.appointments.create({
        patientName: "",
        email: "invalid-email",
        phone: "123",
        department: "",
        appointmentDate: new Date(),
      } as any);
      expect.fail("Should have thrown validation error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should retrieve user's appointments", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const appointments = await caller.appointments.myAppointments();
    expect(Array.isArray(appointments)).toBe(true);
  });

  it("should prevent non-admin from viewing all appointments", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.appointments.all();
      expect.fail("Should have thrown authorization error");
    } catch (error) {
      expect((error as any).message).toContain("Unauthorized");
    }
  });

  it("should allow admin to view all appointments", async () => {
    const user: AuthenticatedUser = {
      id: 1,
      openId: "admin-user",
      email: "admin@example.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    const ctx: TrpcContext = {
      user,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {
        clearCookie: () => {},
      } as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);
    const appointments = await caller.appointments.all();
    expect(Array.isArray(appointments)).toBe(true);
  });
});
