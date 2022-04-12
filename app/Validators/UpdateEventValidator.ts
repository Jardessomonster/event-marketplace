import { rules, schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateEventValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string.optional(),
    description: schema.string.optional(),
    ticket_price: schema.number.optional([rules.unsigned()]),
    qtd_avalible_tickets: schema.number.optional([rules.unsigned()]),
  })

  public messages = {}
}
