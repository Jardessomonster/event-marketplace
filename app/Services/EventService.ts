import Logger from '@ioc:Adonis/Core/Logger'
import Bull from '@ioc:Rocketseat/Bull'
import AddWalletValue from 'App/Jobs/AddWalletValue'
import RemoveWalletValue from 'App/Jobs/RemoveWalletValue'
import Event from 'App/Models/Event'
import User from 'App/Models/User'

type transferData = {
  value: number
  walletId: string
}

class EventService {
  async buyEventTicket(user: User, event: Event) {
    Logger.debug(`EventService.buyEventTicket: Called`)
    const wallet = await user.related('wallet').query().firstOrFail()

    if (wallet.balance < event.ticket_price)
      throw {
        code: 'NOT_ENOUGH_MONEY',
        message: `You don't have enough money to buy this ticket, try add some money to your wallet`,
      }

    const ticket = await event.related('tickets').create({
      buyer_id: user.id,
      paid_value: event.ticket_price,
    })
    Logger.info(
      `EventService.buyEventTicket: User ${user.id} bought the ticket for the event ${event.id}`
    )

    await event.load('owner', (query) => {
      query.preload('wallet')
    })
    const { owner } = event

    this.transferMoney(
      { value: event.ticket_price, walletId: wallet.id },
      { value: event.ticket_price, walletId: owner.wallet.id }
    )

    // update avalible tickets
    event.qtd_avalible_tickets -= 1
    await event.save()
    return ticket
  }

  private transferMoney(sender: transferData, reciver: transferData) {
    // remove money from the buyer wallet
    Bull.add(new RemoveWalletValue().key, sender)
    // add money to event onwer wallet
    Bull.add(new AddWalletValue().key, reciver)
  }
}

export default new EventService()
