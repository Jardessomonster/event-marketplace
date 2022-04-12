import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { userType } from 'Contracts/enums'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string(),
    email: schema.string({}, [
      rules.email(),
      rules.notExist({
        table: 'users',
        column: 'email',
      }),
    ]),
    password: schema.string({}, [rules.minLength(8), rules.maxLength(8)]),
    type: schema.enum(Object.values(userType)),
    avatar: schema.string.optional(),
  })

  public messages = {}
}
