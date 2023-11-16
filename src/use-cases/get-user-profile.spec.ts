import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

describe('Get User Profile use case', () => {
  let inMemoryUsersRepository: InMemoryUsersRepository
  let sut: GetUserProfileUseCase

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(inMemoryUsersRepository)
  })

  it('should be able to get the user profile', async () => {
    const createdUser = await inMemoryUsersRepository.create({
      email: 'user@example.com',
      name: 'user',
      password_hash: 'password',
    })
    const { user } = await sut.execute(createdUser.id)

    expect(user.name).toEqual('user')
  })

  it('should not be able to get user profile with wrong id', async () => {
    expect(() => sut.execute('id-unexistent')).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    )
  })
})
