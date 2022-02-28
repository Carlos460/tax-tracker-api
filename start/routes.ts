/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import Database from '@ioc:Adonis/Lucid/Database'

import Client, { ActiveStatus, CompletionStatus } from 'App/Models/Client'

Route.get('/clients', async ({ response }) => {
  // Returns list of clients for the company currently authenticated
  const data = await Database.from('clients').select('*')
  response.send(data)
})

Route.post('/clients', async ({ request, response }) => {
  // Find client and respond if client already exists
  const userExist = await Client.findBy('firstname', request.body().firstName)
  console.log(userExist?.$isPersisted)
  if (userExist?.$isPersisted)
    response.abort({ message: `Client ${userExist.$original.firstname} already exists` })

  // Create new client
  const client = await Client.create({
    firstname: request.body().firstName,
    initial: request.body().initial,
    lastname: request.body().lastName,
    dropOffDate: request.body().dropOffDate,
  })

  const clientJson = client.serialize()

  if (client.$isPersisted) response.send({ message: `${clientJson.firstname} was added` })
  else response.send({ message: 'something went wrong' })
})

Route.delete('/clients', async ({ request, response }) => {
  const clientIdentifier = request.body().uniqueId

  const client = await Client.findBy('firstname', clientIdentifier)

  if (client) {
    await client.delete()
    if (client.$isDeleted)
      response.send({
        message: `${client.$original.firstname} ${client.$original.initial} ${client.$original.lastname} was deleted.`,
      })
  } else {
    response.send({ message: 'client was not found' })
  }
})

Route.get('/clients/:id', async ({ response }) => {
  // Returns a specific client for the company currently authenticated
  response.send({ message: 'hello' })
})

Route.get('/preparer/:id', async ({ request, response }) => {
  // Returns a specific preparer for the company currently authenticated
  const data = request
  response.send({ message: 'hello', data })
})
