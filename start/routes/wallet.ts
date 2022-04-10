import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'WalletsController.showMyWallet')
  Route.put('/add-money', 'WalletsController.storeMoney')
  Route.put('/remove-money', 'WalletsController.withdraw')
})
  .prefix('/api/v1/wallet')
  .middleware('auth')