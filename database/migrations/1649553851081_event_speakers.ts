import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class EventSpeakers extends BaseSchema {
  protected tableName = 'event_speakers'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('speaker_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.uuid('event_id')
        .references('id')
        .inTable('events')
        .onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
