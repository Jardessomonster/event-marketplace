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
      })

      if (data.speakers)
        await event.useTransaction(trx).related('speakers').attach(data.speakers)

      await this.createEventDays(event, data.event_dates, trx, data.day_titles ? data.day_titles : undefined)
      Logger.info(`EventRepository.createEvent: event days created successfully`)
      await trx.commit()
      return event
    }
    catch (error) {
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
    event_dates.forEach(async (date, index) => {
      // create day with title
      if (day_titles?.length && day_titles[index] !== '') {
        Logger.info(`EventRepository.createEvent: Creating title for event day ${date.day}`)
        await event.useTransaction(trx).related('dates').create({
          event_date: date,
          day_title: day_titles[index],
        })
        return
      }

      await event.useTransaction(trx).related('dates').create({
        event_date: date,
      })
      return
    })
  }
}

export default new EventRepository()