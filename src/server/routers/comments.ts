import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { createRouter } from '~/server/createRouter';
import { prisma } from '~/server/prisma';

const defaultCommentSelect = Prisma.validator<Prisma.CommentSelect>()({
  id: true,
  text: true,
  createdAt: true,
  updatedAt: true,
});

export const commentsRouter = createRouter()
  .query('byPostId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      const comments = await prisma.comment.findMany({
        where: { postId: id },
        select: defaultCommentSelect,
      });

      return comments;
    },
  })
  .mutation('add', {
    input: z.object({
      id: z.string().uuid().optional(),
      text: z.string().min(1),
      postId: z.string().min(1),
    }),
    async resolve({ input }) {
      const comment = await prisma.comment.create({
        data: input,
        select: defaultCommentSelect,
      });
      return comment;
    },
  });
