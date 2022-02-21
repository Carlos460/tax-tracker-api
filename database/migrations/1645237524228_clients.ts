import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Clients extends BaseSchema {
  protected tableName = 'clients'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.enu('active_status', ['Active', 'Inactive']).defaultTo('Active')
      table.string('firstname', 15)
      table.string('initial', 1)
      table.string('lastname', 15)
      table.enu('completion_status', [
        'Unassinged',
        'Assinged',
        'WorkingOn',
        'WaitingOn',
        'Complete',
      ])
      table.dateTime('dropOffDate')
    })
  }

  public async down() {
    this.schema.raw('DROP TYPE IF EXISTS "active_status"')
    this.schema.raw('DROP TYPE IF EXISTS "completion_status"')
    this.schema.dropTable(this.tableName)
  }
}
