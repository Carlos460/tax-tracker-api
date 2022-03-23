import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Client from 'App/Models/Client'

export default class ClientsController {
  /**
   * Index
   */
  public async index(ctx: HttpContextContract) {
    // Returns list of clients for the company currently authenticated
    const clients = await Client.all()
    const clientsJson = clients.map((client) => client.serialize())
    ctx.response.send(clientsJson)
  }
  /**
   * Create
   */
  public async create(ctx: HttpContextContract) {
    // Find client and respond if client already exists
    const userExist = await Client.findBy('unique_id', ctx.request.body().uniqueId)
    if (userExist?.$isPersisted)
      ctx.response.abort({ message: `Client ${userExist.$original.firstname} already exists` })

    // Create new client
    const client = await Client.create({
      uniqueId: ctx.request.body().uniqueId,
      firstname: ctx.request.body().firstName,
      initial: ctx.request.body().initial,
      lastname: ctx.request.body().lastName,
      ssn: ctx.request.body().ssn,
      dropOffDate: ctx.request.body().dropOffDate,
    })

    const clientJson = client.serialize()

    if (client.$isPersisted) ctx.response.send({ message: `${clientJson.firstname} was added` })
    else ctx.response.send({ message: 'something went wrong' })
  }
  /**
   * Delete
   */
  public async delete(ctx: HttpContextContract) {
    const clientIdentifier = ctx.request.body().Id

    const client = await Client.findBy('id', clientIdentifier)

    client ? await client.delete() : ctx.response.abort({ message: 'client was not found' })
    client?.$isDeleted
      ? ctx.response.send({
          message: `${client.$original.firstname} ${client.$original.initial} ${client.$original.lastname} was deleted.`,
        })
      : ctx.response.send({ message: 'somthing went wrong deleting client, try agian' })
  }
  /**
   * Client
   */
  public async client(ctx: HttpContextContract) {
    // Returns a specific client
    const client = await Client.findBy('id', ctx.request.params().id)

    const clientJson = client?.serialize()

    if (!client?.$isPersisted) ctx.response.abort({ message: 'Client does not exist' })
    ctx.response.send(clientJson)
  }
  /**
   * Update
   */
  public async update(ctx: HttpContextContract) {
    ctx.response.send({ message: ctx.request.body() })
  }
}
