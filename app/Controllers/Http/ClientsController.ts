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
    // Checks duplicate ssn - returns if duplicate found
    const userExist = await Client.findBy('ssn', request.body().ssn)

    if (userExist?.$isPersisted)
      response.abort({
        code: '202',
        message: `Client ${userExist.$original.firstname} already exists with same ssn.`,
      })

    const client = await Client.create({
      firstname: request.body().firstName,
      initial: request.body().initial,
      lastname: request.body().lastName,
      ssn: request.body().ssn,
      dropOffDate: request.body().dropOffDate.slice(0, 10),
    })

    const clientJson = client.serialize()

    if (client.$isPersisted)
      response.send({
        code: '200',
        message: `${clientJson.firstname} ${clientJson.initial} ${clientJson.lastName} was added.`,
      })
    else response.send({ code: '500', message: 'Something went wrong when adding the new client.' })
  }

  /**
   * Get Method Index
   * Get an Indexed Client Object
   */
  public async index({ request, response }) {
    const client = await Client.findBy('id', request.params().ssn)

    const clientJson = client?.serialize()

    if (!client?.$isPersisted) response.abort({ code: '404', message: 'Client does not exist,' })
    response.send(clientJson)
  }

  /**
   * PATCH Method
   * Update an Indexed Client Object
   */
  public async patch({ request, response }) {
    // check if client exists
    const clientId = request.body().ssn
    const client = await Client.findBy('ssn', clientId)

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

    response.send({ code: '200', message: 'Client was found.', data: clientJson })
  }

  /**
   * DELETE Method
   * Delete an Indexed Client Object
   */
  public async delete({ request, response }) {
    const clientId = request.body().ssn

    const client = await Client.findBy('ssn', clientId)

    client
      ? await client.delete()
      : response.abort({ code: '404', message: 'Client was not found.' })
    client?.$isDeleted
      ? response.send({
          message: `${client.$original.firstname} ${client.$original.initial} ${client.$original.lastname} was deleted.`,
        })
      : response.send({
          code: '500',
          message: 'Somthing went wrong deleting client in the server, please try agian.',
        })
  }
}
