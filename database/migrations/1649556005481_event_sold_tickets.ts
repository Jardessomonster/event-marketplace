import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class EventSoldTickets extends BaseSchema {
  protected tableName = 'event_sold_ticket'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('buyer_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.uuid('event_id')
        .references('id')
        .inTable('events')
      table.bigInteger('paid_value')
      table.timestamp('created_at', { useTz: false })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
