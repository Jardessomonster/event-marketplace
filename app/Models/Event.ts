import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import EventDate from './EventDate'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public owner_id: string

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public ticket_price: number

  @column()
  public qtd_avalible_price: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public owner: BelongsTo<typeof User>

  @manyToMany(() => User, {
    localKey: 'id',
    relatedKey: 'owner_id',
    pivotForeignKey: 'event_id',
    pivotRelatedForeignKey: 'id',
    pivotTable: 'event_speakers'
  })
  public speakers: ManyToMany<typeof User>

  @hasMany(() => EventDate, {
    localKey: 'id',
    foreignKey: 'event_id'
  })
  public dates: HasMany<typeof EventDate>
}
