import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import formatter from 'App/Helpers/currencyFormatter'

export default class Wallet extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public user_id: string

  @column({ serialize: (value) => { return formatter.format(value / 100) } })
  public balance: number
}
