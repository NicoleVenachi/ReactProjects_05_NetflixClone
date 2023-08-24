import { PrismaClient } from "@prisma/client";


const client = global.prismadb || new PrismaClient()
if (process.env.NODE_ENV === 'production') global.prismadb = client // en producción no tengo que hacer nada (se reasigna a si misma)

export default client 
// exporto prisma instances