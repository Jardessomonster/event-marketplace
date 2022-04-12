import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import { userType } from 'Contracts/enums'

export default class UserTestSeeder extends BaseSeeder {
  public async run () {
    const users = await User.updateOrCreateMany('email', [
      {
        name: 'user consumer',
        email: 'userfortestconsumer@email.com',
        password: 'supersecret123',
        type: userType.CONSUMER,
      },
      {
        name: 'user company',
        email: 'userfortestcompany@email.com',
        password: 'supersecret123',
        type: userType.COMPANY,
      },
      {
        name: 'user university',
        email: 'userfortestuniversity@email.com',
        password: 'supersecret123',
        type: userType.UNIVERSITY,
      }
    ])
    
    for (const user of users) {
      await user.related('wallet').updateOrCreate({ user_id: user.id }, {
        balance: 0
      })
    }
  }
}
