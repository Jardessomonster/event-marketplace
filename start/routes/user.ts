import Route from '@ioc:Adonis/Core/Route'

Route.post('/', 'UsersController.store').prefix('/api/v1/user')

Route.group(() => {
  
})
  .prefix('/api/v1/users')
  .middleware('auth')