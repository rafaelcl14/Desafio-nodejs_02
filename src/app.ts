import fastify from 'fastify'
import cookie from '@fastify/cookie'
import crypto from 'node:crypto'
import { knex } from './database'
import { env } from './env'

import { userRouters } from './routes/user'
import { mealsRouters } from './routes/meals'

export const app = fastify()

app.register(cookie)

app.addHook('preHandler', async (req, rep) => {
  console.log(`[${req.method}] ${req.url}`)
})

app.register(userRouters, {
  prefix: '/user'
})

app.register(mealsRouters, {
  prefix: '/meals'
})
