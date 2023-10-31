import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkIdExists(
  req: FastifyRequest,
  rep: FastifyReply,
) {
  const idUser = req.cookies.idUser

  if (!idUser) {
    return rep.status(401).send({
      error: 'Unauthorized',
    })
  }
}
