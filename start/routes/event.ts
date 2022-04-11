import Route from '@ioc:Adonis/Core/Route'
import { userType } from 'Contracts/enums'

Route.group(() => {
  Route.post('/', 'EventsController.store').middleware(`permission:${userType.COMPANY}`)
})
  .prefix('/api/v1/event')
  .middleware('auth')