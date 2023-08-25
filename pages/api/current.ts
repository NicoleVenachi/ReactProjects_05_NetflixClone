import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end();
    } // limito esta API solo al Get

    const { currentUser } = await serverAuth(req); // traigo current user

    return res.status(200).json(currentUser);
  } catch (error) {
    console.log(error);
    return res.status(500).end(); 
  }
}