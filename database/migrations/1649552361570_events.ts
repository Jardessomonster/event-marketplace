import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Events extends BaseSchema {
  protected tableName = 'events'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').defaultTo(this.raw('uuid_generate_v4()')).primary()
      table.uuid('owner_id').references('id').inTable('users').onDelete('SET NULL')
      table.string('title', 255)
      table.text('description')
      table.bigInteger('ticket_price')
      table.integer('qtd_avalible_tickets')
      table.timestamp('created_at', { useTz: false })
      table.timestamp('updated_at', { useTz: false })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
