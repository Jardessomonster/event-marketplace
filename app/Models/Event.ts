import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import EventDate from './EventDate'
import EventSoldTicket from './EventSoldTicket'
import formatter from 'App/Helpers/currencyFormatter'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public owner_id: string

  @column()
  public title: string

  @column()
  public description: string

  @column({
    serialize: (value) => {
      return formatter.format(value / 100)
    },
  })
  public ticket_price: number

  @column()
  public qtd_avalible_tickets: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'owner_id',
  })
  public owner: BelongsTo<typeof User>

  @manyToMany(() => User, {
    localKey: 'id',
    pivotForeignKey: 'event_id',
    pivotTable: 'event_speakers',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'speaker_id',
  })
  public speakers: ManyToMany<typeof User>

  @hasMany(() => EventDate, {
    localKey: 'id',
    foreignKey: 'event_id',
  })
  public dates: HasMany<typeof EventDate>

  @hasMany(() => EventSoldTicket, {
    localKey: 'id',
    foreignKey: 'event_id',
  })
  public tickets: HasMany<typeof EventSoldTicket>
}
