import Logger from '@ioc:Adonis/Core/Logger'
import Event from 'App/Models/Event'
import User from 'App/Models/User'

class EventService {
  async buyEventTicket(user: User, event: Event) {
    Logger.debug(`EventService.buyEventTicket: Called`)
    const wallet = await user.related('wallet').query().firstOrFail()

    if (wallet.balance < event.ticket_price)
      throw {
        code: 'NOT_ENOUGH_MONEY',
        message: `You don't have enough money to buy this ticket, try add some money to your wallet`
      }

    const ticket = await event.related('tickets').create({
      buyer_id: user.id,
      paid_value: event.ticket_price,
    })
    Logger.info(`EventService.buyEventTicket: User ${user.id} bought the ticket for the event ${event.id}`)
    // update avalible tickets
    event.qtd_avalible_tickets -= 1
    await event.save()
    return ticket
  }
}

export default new EventService()