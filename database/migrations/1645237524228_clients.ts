import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Clients extends BaseSchema {
  protected tableName = 'clients'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.enu('active_status', ['Active', 'Inactive']).defaultTo('Active').notNullable()
      table.string('firstname', 15).notNullable()
      table.string('initial', 1).notNullable()
      table.string('lastname', 15).notNullable()
      table
        .enu('completion_status', ['Unassinged', 'Assinged', 'WorkingOn', 'WaitingOn', 'Complete'])
        .defaultTo('Unassinged')
        .notNullable()
      table.date('drop_off_date').notNullable()
    })
  }

  public async down() {
    // this.schema.raw('DROP TYPE IF EXISTS "active_status"')
    // this.schema.raw('DROP TYPE IF EXISTS "completion_status"')
    this.schema.dropTable(this.tableName)
  }
}
