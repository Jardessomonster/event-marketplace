import Route from '@ioc:Adonis/Core/Route'
import { userType } from 'Contracts/enums'

Route.group(() => {
  Route.get('/', 'WalletsController.showMyWallet')
  Route.put('/add-money', 'WalletsController.storeMoney').middleware(`permission:${userType.CONSUMER}`)
  Route.put('/remove-money', 'WalletsController.withdraw').middleware(`permission:${userType.COMPANY}`)
})
  .prefix('/api/v1/wallet')
  .middleware('auth')