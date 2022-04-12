import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Pagination {
    public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
        if (ctx.request.method() === 'GET') {
            ctx.pagination = ctx.request.only(['page', 'perPage'])

            if (!ctx.pagination.perPage) {
                ctx.pagination.perPage = 20
            }
            if (!ctx.pagination.page) {
                ctx.pagination.page = 1
            }

            const { limit } = ctx.request.only(['limit'])

            if (limit) {
                ctx.pagination.perPage = limit
            }
        }
        await next()
    }
}