import { rules, schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateEventValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string(),
    description: schema.string.optional(),
    ticket_price: schema.number([
      rules.unsigned()
    ]),
    qtd_avalible_tickets: schema.number([
      rules.unsigned()
    ]),
    event_dates: schema.array([
      rules.minLength(1)
    ])
      .members(
        schema.date({ format: 'yyyy-mm-dd hh:mm' }),
      ),
    day_titles: schema.array([
      rules.minLength(1)
    ])
      .members(
        schema.string(),
      ),
    speakers: schema.array.optional()
      .members(
        schema.string([rules.uuid()])
      )
  })

  public messages = {}
}
