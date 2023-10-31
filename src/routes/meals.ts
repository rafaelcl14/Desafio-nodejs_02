import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { checkIdExists } from '../middlewares/check-session-id-exists'

// - Deve ser possível criar um usuário
// - Deve ser possível identificar o usuário entre as requisições


export async function mealsRouters(app: FastifyInstance){
    app.post('/' ,async (req, rep) => {
        
        const createdMeals = z.object({ 
            name: z.string(),
            description: z.string(),
            datetime: z.string().datetime(),
            diet:  z.boolean(),
        })
        
        const { name, description, datetime, diet } = createdMeals.parse(req.body)

        console.log(name, description, datetime, diet)

        const idUser = req.cookies.idUser

        await knex('meals').insert({
            id: randomUUID(),
            name: name,
            description: description,
            datetime: datetime,
            diet: diet,
            user_id: idUser
        })

        return rep.status(201).send()
    })


    app.put('/:idMeals' ,async (req, rep) => {
        const idUser = req.cookies.idUser
        
        const createdMeals = z.object({
            name: z.string(),
            description: z.string(),
            datetime: z.string().datetime(),
            diet: z.boolean()
        })

        const getMeals = z.object({
            idMeals: z.string().uuid()
          })
      
        const { idMeals } = getMeals.parse(req.params)

        const { name, description, datetime, diet } = createdMeals.parse(req.body)

        const update = await knex('meals').where({
            id: idMeals
        }).update({
            name: name,
            description: description,
            datetime: datetime,
            diet: diet,
        }, ['id', 'name', 'description', 'datetime', 'diet'])

        return update
    })


    app.delete('/:idMeals' ,async (req, rep) => {

        const idUser = req.cookies.idUser
        
        const getMeals = z.object({
            idMeals: z.string().uuid()
          })
      
        const { idMeals } = getMeals.parse(req.params)

        const meals = await knex('meals').where({id: idMeals, user_id: idUser}).first()

        await knex('meals').where({id: meals.id}).del()

        return rep.status(200).send()
    })

    app.get('/' ,async (req, rep) => {

        const idUser = req.cookies.idUser
        
        const meals = await knex('meals').where('user_id', idUser)
        .select()

        return {meals}
    })

    app.get('/:idMeals' ,async (req, rep) => {

        const idUser = req.cookies.idUser

        const getMeals = z.object({
            idMeals: z.string().uuid()
          })
      
        const { idMeals } = getMeals.parse(req.params)
      
        
        const meal = await knex('meals').where({
            user_id: idUser,
            id: idMeals,
          })
          .first()

        return { meal }
    })
    

    app.get('/metrics/' ,async (req, rep) => {

        const idUser = req.cookies.idUser

        const totalMeals = await knex('meals').where('user_id', idUser).select()

        const totalDietTrue = await knex('meals').where('diet', 1).select().finally()

        const totalDietFalse = await knex('meals').where('diet', 0).select()

        const metrics = ({
            totalMeals: totalMeals,
            totalDietTrue: totalDietTrue,
            totalDietFalse: totalDietFalse

        })


        return { metrics }
    })


}