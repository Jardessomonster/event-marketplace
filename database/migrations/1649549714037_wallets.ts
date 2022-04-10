import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Wallets extends BaseSchema {
  protected tableName = 'wallets'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').defaultTo(this.raw('uuid_generate_v4()')).primary()
      table.uuid('user_id')
        .references('id')
        .inTable('users')
      table.bigInteger('balance')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
