import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import Logger from '@ioc:Adonis/Core/Logger'
import UserRepository from 'App/Repositories/UserRepository'
import User from 'App/Models/User'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  async index({ response }: HttpContextContract) {
    Logger.debug(`UsersController.index: Called`)
    return response.ok(
      await User.query()
    )
  }

  async show({ response, params }: HttpContextContract) {
    Logger.debug(`UsersController.show: Called`)
    return response.ok(await User.findOrFail(params.id))
  }

  async store({ request, response }: HttpContextContract) {
    Logger.debug(`UsersController.store: Called`)
    const data = await request.validate(CreateUserValidator)
    const user = await UserRepository.createUser(data)
    return response.created(user)
  }

  async update({ request, response, auth }: HttpContextContract) {
    Logger.debug(`UsersController.update: Called`)
    if (!auth.user)
      return response.unauthorized({ message: `User not authorize` })
    
    const user = auth.user
    Logger.info(`UsersController.update: user found ${user.id}`)
    const data = await request.validate(UpdateUserValidator)
    await user.merge(data).save()
    return response.ok(user)
  }
}
