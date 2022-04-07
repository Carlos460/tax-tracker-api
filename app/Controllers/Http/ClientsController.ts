import Client from 'App/Models/Client'

export default class ClientsController {
  /**
   * GET Method
   * Get an Array of the Client Object
   */
  public async get({ response }) {
    const clients = await Client.all()
    const clientsJson = clients.map((client) => client.serialize())
    response.send(clientsJson)
  }

  /**
   * POST Method
   * Create new Client Object
   */
  public async post({ request, response }) {
    const userExist = await Client.findBy('id', request.body().id)

    if (userExist?.$isPersisted)
      response.abort({ message: `Client ${userExist.$original.firstname} already exists` })

    const client = await Client.create({
      id: request.body().id,
      firstname: request.body().firstName,
      initial: request.body().initial,
      lastname: request.body().lastName,
      ssn: request.body().ssn,
      dropOffDate: request.body().dropOffDate,
    })

    const clientJson = client.serialize()

    if (client.$isPersisted) response.send({ message: `${clientJson.firstname} was added` })
    else response.send({ message: 'something went wrong' })
  }

  /**
   * Get Method Index
   * Get an Indexed Client Object
   */
  public async index({ request, response }) {
    const client = await Client.findBy('id', request.params().id)

    const clientJson = client?.serialize()

    if (!client?.$isPersisted) response.abort({ message: 'Client does not exist' })
    response.send(clientJson)
  }

  /**
   * PATCH Method
   * Update an Indexed Client Object
   */
  public async patch({ request, response }) {
    // check if client exists
    const clientId = request.body().id
    const client = await Client.findBy('id', clientId)

    const newClientValues = request.body()

    if (newClientValues.firstName.length !== 0)
      client?.merge({ firstname: newClientValues.firstName })

    if (newClientValues.initial.length !== 0) client?.merge({ initial: newClientValues.initial })

    if (newClientValues.lastName.length !== 0) client?.merge({ lastname: newClientValues.lastName })

    if (newClientValues.ssn.length !== 0) client?.merge({ ssn: newClientValues.ssn })

    if (newClientValues.completionStatus.length !== 0)
      client?.merge({ completionStatus: newClientValues.completionStatus })

    if (newClientValues.dropOffDate.length !== 0)
      client?.merge({ dropOffDate: newClientValues.dropOffDate })

    client?.save()

    const clientJson = client?.serialize()

    response.send({ message: clientJson })
  }

  /**
   * DELETE Method
   * Delete an Indexed Client Object
   */
  public async delete({ request, response }) {
    const clientId = request.body().id

    const client = await Client.findBy('id', clientId)

    client ? await client.delete() : response.abort({ message: 'client was not found' })
    client?.$isDeleted
      ? response.send({
          message: `${client.$original.firstname} ${client.$original.initial} ${client.$original.lastname} was deleted.`,
        })
      : response.send({ message: 'somthing went wrong deleting client, try agian' })
  }
}
