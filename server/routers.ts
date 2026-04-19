import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { createAppointment, getAppointmentsByUserId, getAllAppointments } from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  appointments: router({
    create: protectedProcedure
      .input(
        z.object({
          patientName: z.string().min(1),
          email: z.string().email(),
          phone: z.string().min(10),
          department: z.string().min(1),
          doctor: z.string().optional(),
          appointmentDate: z.date(),
          message: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const result = await createAppointment({
          userId: ctx.user.id,
          patientName: input.patientName,
          email: input.email,
          phone: input.phone,
          department: input.department,
          doctor: input.doctor,
          appointmentDate: input.appointmentDate,
          message: input.message,
        });
        return { success: true, message: "Appointment booked successfully!" };
      }),
    
    myAppointments: protectedProcedure
      .query(async ({ ctx }) => {
        return await getAppointmentsByUserId(ctx.user.id);
      }),
    
    all: protectedProcedure
      .query(async ({ ctx }) => {
        // Only admin can view all appointments
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await getAllAppointments();
      }),
  }),
});

export type AppRouter = typeof appRouter;
