import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export enum ActiveStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export enum CompletionStatus {
  Unassinged = 'Unassinged',
  Assinged = 'Assinged',
  WorkingOn = 'WorkingOn',
  WaitingOn = 'WaitingOn',
  Complete = 'Complete',
}

export default class Client extends BaseModel {
  // Unique ID
  @column({ isPrimary: true })
  public ssn: string

  // General Info
  @column()
  public id: string

  @column()
  public activeStatus: ActiveStatus

  @column()
  public firstname: string

  @column()
  public initial: string

  @column()
  public lastname: string

  // Track Info
  @column()
  public completionStatus: CompletionStatus

  @column.date()
  public dropOffDate: DateTime
}
