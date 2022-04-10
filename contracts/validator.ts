declare module '@ioc:Adonis/Core/Validator' {
  interface Rules {
      notExist(options: DbRowCheckOptions): Rule,
  }
}