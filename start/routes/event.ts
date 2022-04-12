import Route from '@ioc:Adonis/Core/Route'
import { userType } from 'Contracts/enums'

Route.group(() => {
  Route.get(':id/', 'EventsController.show')
  Route.get('/', 'EventsController.listEvents').middleware(`permission:${userType.CONSUMER}`)
  Route.post(':id/ticket', 'EventsController.buyTicket').middleware(`permission:${userType.CONSUMER}`)
  Route.post('/', 'EventsController.store').middleware(`permission:${userType.COMPANY}`)
  Route.put(':id/', 'EventsController.update').middleware(`permission:${userType.COMPANY}`)
  Route.delete(':id/', 'EventsController.destroy').middleware(`permission:${userType.COMPANY}`)
})
  .prefix('/api/v1/events')
  .middleware('auth')