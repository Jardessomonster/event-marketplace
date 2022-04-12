declare module '@ioc:Adonis/Core/HttpContext' {
  import User from 'App/Models/User'

  interface HttpContextContract {
      pagination: {
          page: number
          perPage: number
      }
  }
}