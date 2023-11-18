import { ICheckInsRepository } from '@/repositories/check-ins.repository'
import { CheckIn } from '@prisma/client'
import { TwiceCheckInsADayError } from './errors/twice-check-ins-a-day-error'
import { DistantGymError } from './errors/distant-gym-error'
import { IGymsRepository } from '@/repositories/gyms.repository'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface ICheckInUseCaseRequest {
  userId: string
  gymId: string
  latitude: number
  longitude: number
}

interface ICheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: ICheckInsRepository,
    private gymsRepository: IGymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    latitude,
    longitude,
  }: ICheckInUseCaseRequest): Promise<ICheckInUseCaseResponse> {
    const checkInToday = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )
    if (checkInToday) {
      throw new TwiceCheckInsADayError()
    }

    const gym = await this.gymsRepository.findById(gymId)
    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude, longitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )
    const MAX_DISTANCE_IN_KILOMETERS = 0.1
    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new DistantGymError()
    }

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    return { checkIn }
  }
}
