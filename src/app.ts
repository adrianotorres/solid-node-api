import fastify from 'fastify'
import { registerRoute } from './http/routes'
import { ZodError } from 'zod'
import { env } from './env'

export const app = fastify()

app.register(registerRoute)

app.setErrorHandler((err, _request, reply) => {
  if (err instanceof ZodError) {
    reply
      .status(400)
      .send({ message: 'Validation error', issues: err.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(err)
  } else {
    // TODO log on Datadog
  }

  reply.status(500).send({ message: 'Internal server error' })
})
