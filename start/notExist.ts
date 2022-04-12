import { validator } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'

type DbRowCheckOptions = {
  table: string
  column: string
  where?: {
    [key: string]: any
  }
  whereNot?: {
    [key: string]: any
  }
}

validator.rule(
  'notExist',
  async (value, args: DbRowCheckOptions[], options) => {
    const dbOptions = args[0]
    const query = Database.from(dbOptions.table).where(dbOptions.column, value)

    if (dbOptions.where) {
      query.andWhere(dbOptions.where)
    }
    if (dbOptions.whereNot) {
      query.andWhereNot(dbOptions.whereNot)
    }
    const row = await query.first()

    if (row) {
      options.errorReporter.report(
        options.pointer,
        'notExist',
        'notExist validation failed',
        options.arrayExpressionPointer
      )
    }

    return
  },
  () => {
    return { async: true }
  }
)
