import { ICheckInsRepository } from '@/repositories/check-ins.repository'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins.repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { TwiceCheckInsADayError } from './errors/twice-check-ins-a-day-error'

describe('Check-in Use Case', () => {
  let sut: CheckInUseCase
  let checkInsRepository: ICheckInsRepository

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInsRepository)
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2023, 0, 10, 12, 0, 0))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice a day', async () => {
    const checkInData = {
      user_id: 'user-id',
      gym_id: 'gym-id',
    }

    const checkIn = await checkInsRepository.create(checkInData)

    await expect(() =>
      sut.execute({
        userId: checkIn.user_id,
        gymId: checkIn.gym_id,
      }),
    ).rejects.toBeInstanceOf(TwiceCheckInsADayError)
  })

  it('should be able to check in twice in different days', async () => {
    const firstCheckIn = await checkInsRepository.create({
      user_id: 'user-id',
      gym_id: 'gym-id',
    })

    vi.setSystemTime(new Date(2023, 0, 11, 11, 0, 0, 0))

    const { checkIn } = await sut.execute({
      userId: firstCheckIn.user_id,
      gymId: firstCheckIn.gym_id,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
