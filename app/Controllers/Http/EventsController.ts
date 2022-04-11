import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import EventRepository from 'App/Repositories/EventRepository'
import CreateEventValidator from 'App/Validators/CreateEventValidator'

export default class EventsController {
  async store({ request, response, auth }: HttpContextContract) {
    Logger.debug(`EventsController.store: Called`)
    if (!auth.user)
      return response.unauthorized({ message: `User not authorize` })

    const data = await request.validate(CreateEventValidator)
    const event = await EventRepository.createEvent(auth.user, data)
    await event.load('dates')

    return response.created(event)
  }
}
