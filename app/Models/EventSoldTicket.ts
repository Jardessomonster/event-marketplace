import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Event from './Event'

export default class EventSoldTicket extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public buyer_id: string

  @column()
  public event_id: string

  @column()
  public paid_value: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @belongsTo(() => Event, {
    localKey: 'event_id',
    foreignKey: 'id'
  })
  public event: BelongsTo<typeof Event>
}
