import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import Logger from '@ioc:Adonis/Core/Logger'
import UserRepository from 'App/Repositories/UserRepository'

export default class UsersController {
  async store({ request, response }: HttpContextContract) {
    Logger.debug(`UsersController.store: Called`)
    const data = await request.validate(CreateUserValidator)
    const user = await UserRepository.createUser(data)
    return response.created(user)
  }
}
