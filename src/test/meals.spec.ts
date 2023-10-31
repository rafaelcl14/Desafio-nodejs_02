/* eslint-disable prettier/prettier */
import { expect, beforeAll, afterAll, describe, it, beforeEach } from 'vitest'
import request from 'supertest'
import { execSync } from 'node:child_process'
import { app } from '../app'

describe('Rotas de Meals', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('Deve ser possível criar um usuário', async () => {
    await request(app.server).post('/user').send({
      name: 'Rafael Rosina',
      email: 'rafae.rosina@gmail.com',
    })
    .expect(201)
  })

  it('Deve ser possível registrar uma refeição feita, com as seguintes informações', async () => {
    const createMealsResponse = await request(app.server)
      .post('/meals')
      .send({
        name: 'Teste Diet',
        description: 'Diet Test',
        datetime: Date.now(),
        diet:  true,
      })

    const cookies = createMealsResponse.get('Set-Cookie')

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        name: 'Teste Diet',
        description: 'Diet Test',
        datetime: Date.now(),
        diet:  true,
      }),
    ])
  })

  it('Deve ser possível editar uma refeição, podendo alterar todos os dados acima', async () => {
    const createMealsResponse = await request(app.server)
      .put('/meals')
      .send({
        name: 'Teste Diet ALTERNATVE',
        description: 'Diet Test 2.1',
        datetime: Date.now(),
        diet:  true,
      })

    const cookies = createMealsResponse.get('Set-Cookie')

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealsId = listMealsResponse.body.meals[0].id

    const getMealsResponse = await request(app.server)
      .get(`/meals/${mealsId}`)
      .set('Cookie', cookies)
      .expect(200)


    expect(getMealsResponse.body.meals).toEqual(
      expect.objectContaining({
        name: 'Teste Diet ALTERNATVE',
        description: 'Diet Test 2.1',
        datetime: Date.now(),
        diet:  true,
      }),
    )
  })

  
  // it('O usuario deve poder obter um resumo da sua conta', async () => {
  //   const createTransactionResponse = await request(app.server)
  //     .post('/transactions')
  //     .send({
  //       title: 'New transaction',
  //       amount: 5000,
  //       type: 'credit',
  //     })

  //   const cookies = createTransactionResponse.get('Set-Cookie')

  //   await request(app.server)
  //     .post('/transactions')
  //     .set('Cookie', cookies)
  //     .send({
  //       title: 'New transaction',
  //       amount: 2000,
  //       type: 'debit',
  //     })

  //   const symmaryResponse = await request(app.server)
  //     .get('/transactions/summary')
  //     .set('Cookie', cookies)
  //     .expect(200)

  //   expect(symmaryResponse.body.summary).toEqual({
  //     amount: 3000,
  //   })
  // })

})
