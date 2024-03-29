import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { userType } from 'Contracts/enums'

export default class UserPermission {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>, guards: string[]) {
    if (!ctx.auth.user) return ctx.response.unauthorized({ message: 'You are not authorized' })

    if (
      ctx.auth.user.type === userType.CONSUMER &&
      (guards[0] === userType.COMPANY || guards[0] === userType.UNIVERSITY)
    )
      return ctx.response.forbidden({ message: 'Your user type cannot peform this action' })

    if (
      (ctx.auth.user.type === userType.COMPANY || ctx.auth.user.type === userType.UNIVERSITY) &&
      guards[0] === userType.CONSUMER
    )
      return ctx.response.forbidden({ message: 'Your user type cannot peform this action' })

    return await next()
  }
}
