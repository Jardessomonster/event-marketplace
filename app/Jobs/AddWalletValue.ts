import { JobContract } from '@ioc:Rocketseat/Bull'
import Logger from '@ioc:Adonis/Core/Logger'
import Wallet from 'App/Models/Wallet'

/*
|--------------------------------------------------------------------------
| Job setup
|--------------------------------------------------------------------------
|
| This is the basic setup for creating a job, but you can override
| some settings.
|
| You can get more details by looking at the bullmq documentation.
| https://docs.bullmq.io/
*/

type addValueData = {
  data: {
    value: number
    walletId: string
  }
}

export default class AddWalletValue implements JobContract {
  public key = 'AddWalletValue'

  public async handle(job: addValueData) {
    Logger.debug(`AddWalletValue: Job called`)
    const { data } = job
    const wallet = await Wallet.findOrFail(data.walletId)
    wallet.balance = Number(wallet.balance) + Number(data.value)
    await wallet.save()
    Logger.info(`AddWalletValue: added value to the wallet ${data.value}`)
  }
}
