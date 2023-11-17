import { ICheckInsRepository } from '@/repositories/check-ins.repository'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins.repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CheckInUseCase } from './check-in'

describe('Check-in Use Case', () => {
  let sut: CheckInUseCase
  let checkInsRepository: ICheckInsRepository

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInsRepository)
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
