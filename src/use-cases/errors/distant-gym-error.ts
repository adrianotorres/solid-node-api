export class DistantGymError extends Error {
  constructor() {
    super('You cannot check-in on a distant gym')
  }
}
