import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { userType } from 'Contracts/enums'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').defaultTo(this.raw('uuid_generate_v4()')).primary()
      table.string('email', 255).notNullable()
      table.string('password', 180).notNullable()
      table.enum('type', Object.values(userType))
      table.string('token', 255).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
