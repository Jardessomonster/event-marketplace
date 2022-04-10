import Logger from '@ioc:Adonis/Core/Logger'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import { userType } from 'Contracts/enums'

type createUserData = {
  name: string
  email: string
  password: string
  type: userType
  avatar?: string
}

class UserRepository {
  async createUser(data: createUserData) {
    Logger.debug(`UserRepository.createUser: Called`)
    const trx = await Database.transaction()

    try {
      const user = await User.create(data, { client: trx })
      Logger.info(`UserRepository.createUser: user created ${user.name}`)
      await user.useTransaction(trx).related('wallet').create({
        balance: 0,
      })
      Logger.info(`UserRepository.createUser: wallet created for user ${user.name}`)
      await trx.commit()
      return user
    }
    catch(error) {
      Logger.error(`UserRepository.createUser: ${error.message}`)
      await trx.rollback()
      throw new Error(error)
    }
  }
}

export default new UserRepository()