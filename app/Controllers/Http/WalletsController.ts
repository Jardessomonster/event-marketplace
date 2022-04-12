import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import Bull from '@ioc:Rocketseat/Bull'
import AddWalletValue from 'App/Jobs/AddWalletValue'
import RemoveWalletValue from 'App/Jobs/RemoveWalletValue'
import MoneyValidator from 'App/Validators/MoneyValidator'

export default class WalletsController {
  async showMyWallet({ response, auth }: HttpContextContract) {
    Logger.debug(`WalletsController.showMyWallet: Called`)
    return response.ok(
      await auth.user?.related('wallet').query().firstOrFail()
    )
  }

  async storeMoney({ request, response, auth }: HttpContextContract) {
    Logger.debug(`WalletsController.storeMoney: Called`)
    const { value } = await request.validate(MoneyValidator)
    if (!auth.user)
      return response.unauthorized({ message: `User not authorize` })

    const wallet = await auth.user.related('wallet').query().firstOrFail()
    Logger.info(`WalletsController.storeMoney: Inserting wallet ${wallet.id} into queue`)
    Bull.add(new AddWalletValue().key, {
      value,
      walletId: wallet.id
    })
    return response.noContent()
  }
  // remove money from wallet
  async withdraw({ request, response, auth }: HttpContextContract) {
    Logger.debug(`WalletsController.withdraw: Called`)
    const { value } = await request.validate(MoneyValidator)    
    if (!auth.user)
      return response.unauthorized({ message: `User not authorize` })

    const wallet = await auth.user.related('wallet').query().firstOrFail()
    if (wallet.balance < value)
      return response.forbidden({
        message: 'The value you tryed to remove from your account is bigger than your balance'
      })

    Logger.info(`WalletsController.withdraw: Inserting wallet ${wallet.id} into queue`)
    Bull.add(new RemoveWalletValue().key, {
      value,
      walletId: wallet.id
    })
    return response.noContent()
  }
}
