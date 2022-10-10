import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Create New Home
  if (req.method === 'POST') {
    try {
      const { image, title, description, price, guests, beds, baths } =
        req.body;

      const home = await prisma.home.create({
        data: {
          image,
          title,
          description,
          price,
          guests,
          beds,
          baths,
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
