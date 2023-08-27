import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import prismadb from '@/lib/prismadb';
// import { authOptions } from "@/pages/api/auth/[...nextauth]";

const serverAuth = async (req: NextApiRequest) => {
  //traigo la sesion (req, tiene jwt)
  const session = await getServerSession(req);

  if (!session?.user?.email) {
    throw new Error('Not signed in');
  } // sino hay session, no estoy loguedo

  const currentUser = await prismadb.user.findUnique({
    where: {
      email: session.user.email,
    }
  }); //si hay session, traigo el user

  if (!currentUser) {
    throw new Error('Not signed in');
  } // si ese user no existe digo lo mismo, no estoy logueado (tal ve fue deleted)

  return { currentUser };
}

export default serverAuth;