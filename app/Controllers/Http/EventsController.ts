import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import Event from 'App/Models/Event'
import EventRepository from 'App/Repositories/EventRepository'
import EventService from 'App/Services/EventService'
import CreateEventValidator from 'App/Validators/CreateEventValidator'
import UpdateEventValidator from 'App/Validators/UpdateEventValidator'
import { userType } from 'Contracts/enums'

export default class EventsController {
  async listEvents({ auth, response, pagination }: HttpContextContract) {
    Logger.debug(`EventsController.index: Called`)
    if (!auth.user) return response.unauthorized({ message: `User not authorize` })

    const user = auth.user
    return response.ok(
      await Event.query()
        .preload('owner')
        .preload('speakers')
        .whereDoesntHave('tickets', (subQuery) => {
          subQuery.where('buyer_id', user.id)
        })
        .andWhere('qtd_avalible_tickets', '>', 0)
        .paginate(pagination.page, pagination.perPage)
    )
  }

  async show({ response, params }: HttpContextContract) {
    Logger.info(`EventsController.show: Called`)
    const event = await Event.query()
      .preload('owner')
      .preload('speakers')
      .where('id', params.id)
      .firstOrFail()

    Logger.info(`EventsController.show: event found ${event.id}`)
    return response.ok(event)
  }

  async myEvents({ response, auth, pagination }: HttpContextContract) {
    Logger.debug(`EventsController.myEvents: Called`)
    if (!auth.user) return response.unauthorized({ message: `User not authorize` })

    const user = auth.user
    const events =
      user.type === userType.CONSUMER
        ? await Event.query()
            .preload('owner')
            .preload('speakers')
            .whereHas('tickets', (query) => {
              query.where('buyer_id', user.id)
            }).paginate(pagination.page, pagination.perPage)
        : await Event.query().preload('owner').preload('speakers').where('owner_id', user.id).paginate(pagination.page, pagination.perPage)
      
    Logger.info(`EventsController.myEvents: Found events for user ${user.id} of type ${user.type}`)
    return response.ok(events)
  }

  async store({ request, response, auth }: HttpContextContract) {
    Logger.debug(`EventsController.store: Called`)
    if (!auth.user) return response.unauthorized({ message: `User not authorize` })

    const data = await request.validate(CreateEventValidator)
    const event = await EventRepository.createEvent(auth.user, data)
    await event.load('dates')
    await event.load('speakers')

    return response.created(event)
  }

  async buyTicket({ response, params, auth }: HttpContextContract) {
    Logger.debug(`EventsController.buyTicket: Called`)
    if (!auth.user) return response.unauthorized({ message: `User not authorize` })

    const user = auth.user
    const event = await Event.query()
      .where('id', params.id)
      .whereDoesntHave('tickets', (subQuery) => {
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

  async update({ request, response, params, auth }: HttpContextContract) {
    Logger.debug(`EvemtsController.update: Called`)
    const data = await request.validate(UpdateEventValidator)
    if (!auth.user) return response.unauthorized({ message: `User not authorize` })

    const event = await auth.user.related('events').query().where('id', params.id).firstOrFail()
    Logger.info(`EvemtsController.update: found event ${event.id}`)
    await event.merge(data).save()
    return response.ok(event)
  }

  async destroy({ response, params, auth }) {
    Logger.debug(`EvemtsController.destroy: Called`)
    if (!auth.user) return response.unauthorized({ message: `User not authorize` })

    const event = await auth.user.related('events').query().where('id', params.id).firstOrFail()
    Logger.info(`EvemtsController.destroy: found event ${event.id}`)
    await event.related('tickets').query().delete()
    await event.related('speakers').query().delete()
    await event.delete()
    return response.noContent()
  }
}
