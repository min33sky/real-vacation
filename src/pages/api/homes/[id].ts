// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Check if user is authenticated
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  // Retrieve the authenticated user
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email ?? undefined },
    select: {
      listedHomes: true,
    },
  });

  // Check if authenticated user is the owner of the home
  const { id } = req.query;
  if (!user?.listedHomes.find((home) => home.id === id)) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  // Update home
  if (req.method === 'PATCH') {
    try {
      const home = await prisma.home.update({
        where: { id: Array.isArray(id) ? id[0] : id },
        data: req.body,
      });
      res.status(200).json(home);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).json({
      message: `HTTP Method ${req.method} is not supported.`,
    });
  }
}
