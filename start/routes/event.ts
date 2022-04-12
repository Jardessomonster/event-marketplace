import Route from '@ioc:Adonis/Core/Route'
import { userType } from 'Contracts/enums'

Route.group(() => {
  Route.get('/', 'EventsController.listEvents')
  Route.post(':id/ticket', 'EventsController.buyTicket').middleware(`permission:${userType.CONSUMER}`)
  Route.post('/', 'EventsController.store').middleware(`permission:${userType.COMPANY}`)
})
  .prefix('/api/v1/events')
  .middleware('auth')