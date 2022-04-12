/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }
  public async handle(error: any, { response }) {
    Logger.warn(`Name Exception: ${error.type}`)
    Logger.warn(`Name Exception: ${error}`)
    if (error.code === 'ERR_HTTP_INVALID_STATUS_CODE')
      return response.status(500).send({ message: 'An error has occurred :/' })

    if (error.code === 'NOT_ENOUGH_MONEY')
      return response.forbidden(error)

    return response.status(error.status).send(error)
  }
}
