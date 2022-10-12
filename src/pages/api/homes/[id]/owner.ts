// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Get the home's onwer
  if (req.method === 'GET') {
    try {
      const { id } = req.query;
      const home = await prisma.home.findUnique({
        where: { id: Array.isArray(id) ? id[0] : id },
        select: { owner: true },
      });

      if (!home) {
        return res.status(404).json({ message: 'Home not found.' });
      }

      res.status(200).json(home.owner);
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
  // HTTP method not supported!
  else {
    res.setHeader('Allow', ['GET']);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
