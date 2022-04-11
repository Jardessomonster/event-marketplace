import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class EventDate extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public event_id: string

  @column()
  public event_date: DateTime

  @column()
  public day_title: string
}
