import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Check if user is authenticated
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  // Create New Home
  if (req.method === 'POST') {
    try {
      const { image, title, description, price, guests, beds, baths } =
        req.body;

      // Retrieve the current authenticated user
      const user = await prisma.user.findUnique({
        where: { email: session.user?.email ?? undefined },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      const home = await prisma.home.create({
        data: {
          image,
          title,
          description,
          price,
          guests,
          beds,
          baths,
          ownerId: user.id,
        },
      });

      res.status(200).json(home);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    // HTTP method not supported!!
    res.setHeader('Allow', ['POST']);
    res.status(405).json({
      message: `HTTP Method ${req.method} is not supported.`,
    });
  }
}
