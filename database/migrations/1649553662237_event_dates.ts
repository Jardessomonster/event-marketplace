import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class EventDates extends BaseSchema {
  protected tableName = 'event_dates'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('event_id').references('id').inTable('events').onDelete('CASCADE')
      table.timestamp('event_date', { useTz: false })
      table.string('day_title').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
