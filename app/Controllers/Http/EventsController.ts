import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import Event from 'App/Models/Event'
import EventRepository from 'App/Repositories/EventRepository'
import EventService from 'App/Services/EventService'
import CreateEventValidator from 'App/Validators/CreateEventValidator'

export default class EventsController {
  async listEvents({ auth, response, pagination }: HttpContextContract) {
    Logger.debug(`EventsController.index: Called`)
    if (!auth.user)
      return response.unauthorized({ message: `User not authorize` })

    const user = auth.user
    return response.ok(
      await Event.query()
        .preload('owner')
        .preload('speakers')
        .withCount('tickets')
        .whereDoesntHave('tickets', subQuery => {
          subQuery.where('buyer_id', user.id)
        })
        .andWhere('qtd_avalible_tickets', '>', 0)
        .paginate(pagination.page, pagination.perPage)
    )
  }

  async store({ request, response, auth }: HttpContextContract) {
    Logger.debug(`EventsController.store: Called`)
    if (!auth.user)
      return response.unauthorized({ message: `User not authorize` })

    const data = await request.validate(CreateEventValidator)
    const event = await EventRepository.createEvent(auth.user, data)
    await event.load('dates')

    return response.created(event)
  }

  async buyTicket({ response, params, auth }: HttpContextContract) {
    Logger.debug(`EventsController.buyTicket: Called`)
    if (!auth.user)
      return response.unauthorized({ message: `User not authorize` })

    const user = auth.user
    const event = await Event.query()
      .where('id', params.id)
      .whereDoesntHave('tickets', subQuery => {
        subQuery.where('buyer_id', user.id)
      })
      .firstOrFail()
  
    Logger.info(`EventsController.buyTicket: found event ${event.id}`)
    if (event.qtd_avalible_tickets <= 0) {
      Logger.warn(`EventsController.buyTicket: The tickets for the event ${event.id} is over`)
      return response.forbidden({ message: `The tickets for this event are over` })
    }

    const ticket = await EventService.buyEventTicket(user, event)
    return response.created(ticket)
  }
}
