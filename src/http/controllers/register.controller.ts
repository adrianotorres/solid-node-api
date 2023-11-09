import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users.repository'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { RegisterUseCase } from '@/use-cases/register'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.coerce.string().min(6),
  })

  const { name, email, password } = registerSchema.parse(request.body)

  const prismaUsersRepository = new PrismaUsersRepository()
  const registerUseCase = new RegisterUseCase(prismaUsersRepository)

  try {
    await registerUseCase.execute({ name, email, password })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}
