import { z } from 'zod';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';

export const authRouter = createRouter().mutation('add', {
  input: z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1).max(32),
    email: z.string().email(),
    password: z.string().min(1).max(32),
  }),
  async resolve({ input }) {
    const newUser = await prisma.user.create({
      data: input,
    });
    return newUser;
  },
});
