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
  const userExist = await Client.findBy('unique_id', request.body().uniqueId)
  if (userExist?.$isPersisted)
    response.abort({ message: `Client ${userExist.$original.firstname} already exists` })

  // Create new client
  const client = await Client.create({
    uniqueId: request.body().uniqueId,
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

  const client = await Client.findBy('unique_id', clientIdentifier)

  client ? await client.delete() : response.abort({ message: 'client was not found' })
  client?.$isDeleted
    ? response.send({
        message: `${client.$original.firstname} ${client.$original.initial} ${client.$original.lastname} was deleted.`,
      })
    : response.send({ message: 'somthing went wrong deleting client, try agian' })
})

Route.get('/clients/:id', async ({ response }) => {
  // Returns a specific client for the company currently authenticated
  const client = await Client.findBy('unique_id', request.params().unique_id)

  const clientJson = client?.serialize()

  if (!client?.$isPersisted) response.abort({ message: 'Client does not exist' })
  response.send(clientJson)
})

Route.get('/preparer/:id', async ({ request, response }) => {
  // Returns a specific preparer for the company currently authenticated
  const data = request
  response.send({ message: 'hello', data })
})
