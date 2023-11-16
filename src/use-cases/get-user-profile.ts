import { IUsersRepository } from '@/repositories/users.repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

export class GetUserProfileUseCase {
  constructor(private userRepository: IUsersRepository) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return { user }
  }
}
