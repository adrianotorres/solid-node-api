import { Prisma } from '@prisma/client'
import { ICheckInsRepository } from '../check-ins.repository'
import { prisma } from '@/lib/prisma'

export class PrismaCheckInsRepository implements ICheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({ data })

    return checkIn
  }
}
