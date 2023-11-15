import { describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'
import { Prisma } from '@prisma/client'
import { hash } from 'bcryptjs'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate use case', () => {
  it('should be able to authenticate', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(inMemoryUsersRepository)

    const user = {
      email: 'user@example.com',
      password_hash: await hash('password', 6),
      name: 'John',
    } as Prisma.UserCreateInput

    inMemoryUsersRepository.create(user)

    const { user: authenticatedUser } = await sut.execute({
      email: user.email,
      password: 'password',
    })

    expect(authenticatedUser.id).toEqual(expect.any(String))
  })

  it('should be not able to authenticate with a wrong password', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(inMemoryUsersRepository)

    const user = {
      email: 'user@example.com',
      password_hash: await hash('password', 6),
      name: 'John',
    } as Prisma.UserCreateInput

    inMemoryUsersRepository.create(user)

    expect(() =>
      sut.execute({
        email: 'user@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should be not able to authenticate with a wrong email', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(inMemoryUsersRepository)

    expect(() =>
      sut.execute({
        email: 'user@example.com',
        password: 'password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
