export class TwiceCheckInsADayError extends Error {
  constructor() {
    super('You cannot check in twice a day')
  }
}
