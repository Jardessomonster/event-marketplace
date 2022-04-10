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
    value: number,
    walletId: string
  }
}

export default class RemoveWalletValue implements JobContract {
  public key = 'RemoveWalletValue'

  public async handle(job: addValueData) {
    Logger.debug(`RemoveWalletValue: Job called`)
    const { data } = job
    const wallet = await Wallet.findOrFail(data.walletId)
    wallet.balance = Number(wallet.balance) - data.value
    await wallet.save()
    Logger.info(`RemoveWalletValue: removed value from the wallet ${data.value}`)
  }
}
