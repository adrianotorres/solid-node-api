import { CheckIn, Prisma } from '@prisma/client'
import { ICheckInsRepository } from '../check-ins.repository'
import { randomUUID } from 'crypto'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements ICheckInsRepository {
  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfDay = dayjs(date).startOf('date')
    const endOfDay = dayjs(date).endOf('date')

    const checkIn = this.items.find((item) => {
      const checkInDate = dayjs(item.created_at)
      const isOnSameDay =
        checkInDate.isAfter(startOfDay) && checkInDate.isBefore(endOfDay)
      return item.user_id === userId && isOnSameDay
    })

    return checkIn || null
  }

  public items: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    } as CheckIn

    this.items.push(checkIn)

    return checkIn
  }
}
