import Route from '@ioc:Adonis/Core/Route'

Route.post('/', 'UsersController.store').prefix('/api/v1/users')

Route.group(() => {
  Route.get('/', 'UsersController.index')
  Route.get(':id/', 'UsersController.show')
  Route.put(':id/', 'UsersController.update')
})
  .prefix('/api/v1/users')
  .middleware('auth')
