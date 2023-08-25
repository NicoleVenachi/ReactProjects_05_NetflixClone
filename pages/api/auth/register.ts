import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try { // si puede o no registrar
    if (req.method !== 'POST') {
      return res.status(405).end();
    } // limito esta ruta a post calls

    const { email, name, password } = req.body; //scao crendenciales

    const existingUser = await prismadb.user.findUnique({
      where: {
        email
      }
    }) //veo si existe el user

    if (existingUser) {
      return res.status(422).json({ error: 'Email taken' }); 
    } //si ya existe el user, notifico

    const hashedPassword = await bcrypt.hash(password, 12); // sino existe, hasheo el password

    const user = await prismadb.user.create({
      data: {
        email,
        name,
        hashedPassword,
        image: '',
        emailVerified: new Date(),
      }
    }) // finalmente, creo el user en la db

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ error: `Something went wrong: ${error}` });
  }
}