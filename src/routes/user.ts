import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

// - Deve ser possível criar um usuário
// - Deve ser possível identificar o usuário entre as requisições


export async function userRouters(app: FastifyInstance){
    app.post('/', async (req, rep) => {
        // Validação com Zod para validar o tipo de dado que estamos recebendo
        const createUser = z.object({
            name: z.string(),
            email: z.string().email(),
        })

        const { name, email } = createUser.parse(req.body)

        let idUser = req.cookies.idUser

        // TODO: Criação do Usuario

        if(!idUser){
            const created = await knex('user')
            .returning('id')
            .insert({
                id: randomUUID(),
                name,
                email,
            })

            const id: string = created[0].id

            rep.cookie('idUser', id,{
                path: '/',
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            })

            return rep.status(201).send()

        }

        return rep.status(401).send({
            error: 'Erro ao criar usuario',
        })
        
    })
}