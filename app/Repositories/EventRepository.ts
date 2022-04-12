import Logger from '@ioc:Adonis/Core/Logger'
import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import Event from 'App/Models/Event'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

type createEventData = {
  title: string
  description?: string
  ticket_price: number
  qtd_avalible_tickets: number
  event_dates: DateTime[]
  day_titles?: string[]
  speakers?: string[]
}

class EventRepository {
  async createEvent(user: User, data: createEventData) {
    Logger.debug(`EventRepository.createEvent: Called`)
    const trx = await Database.transaction()

    try {
      const event = await user.useTransaction(trx).related('events').create({
        title: data.title,
        description: data?.description,
        ticket_price: data.ticket_price,
        qtd_avalible_tickets: data.qtd_avalible_tickets,
      })

      if (data.speakers) await event.useTransaction(trx).related('speakers').attach(data.speakers)

      await this.createEventDays(
        event,
        data.event_dates,
        trx,
        data.day_titles ? data.day_titles : undefined
      )
      Logger.info(`EventRepository.createEvent: event days created successfully`)
      await trx.commit()
      return event
    } catch (error) {
      Logger.error(`EventRepository.createEvent: An error has occurred ${error}`)
      await trx.rollback()
      throw new Error(error)
    }
  }

  async createEventDays(
    event: Event,
    event_dates: DateTime[],
    trx: TransactionClientContract,
    day_titles?: string[]
  ) {
    for (const index in event_dates) {
      // create day with title
      if (day_titles?.length && day_titles[index] !== '') {
        Logger.info(
          `EventRepository.createEvent: Creating title for event day ${event_dates[index].day}`
        )
        await event.useTransaction(trx).related('dates').create({
          event_date: event_dates[index],
          day_title: day_titles[index],
        })
      } else {
        await event.useTransaction(trx).related('dates').create({
          event_date: event_dates[index],
        })
      }
    }
  }
}

export default new EventRepository()
