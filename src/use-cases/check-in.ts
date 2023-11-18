import { ICheckInsRepository } from '@/repositories/check-ins.repository'
import { CheckIn } from '@prisma/client'
import { TwiceCheckInsADayError } from './errors/twice-check-ins-a-day-error'

interface ICheckInUseCaseRequest {
  userId: string
  gymId: string
}

interface ICheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  async execute({
    userId,
    gymId,
  }: ICheckInUseCaseRequest): Promise<ICheckInUseCaseResponse> {
    const checkInToday = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInToday) {
      throw new TwiceCheckInsADayError()
    }

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    return { checkIn }
  }
}
