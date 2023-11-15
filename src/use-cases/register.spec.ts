import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register use case', () => {
  it('should be able to register', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const sut = new RegisterUseCase(inMemoryUsersRepository)

    const { user } = await sut.execute({
      email: 'user@example.com',
      name: 'user',
      password: 'password',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hashs user password upon registration', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const sut = new RegisterUseCase(inMemoryUsersRepository)

    const { user } = await sut.execute({
      email: 'user@example.com',
      name: 'user',
      password: 'password',
    })

    const isPasswordCorrectlyHashed = await compare(
      'password',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const sut = new RegisterUseCase(inMemoryUsersRepository)

    const email = 'user@example.com'
    await sut.execute({
      email,
      name: 'user',
      password: 'password',
    })

    expect(() =>
      sut.execute({
        email,
        name: 'user',
        password: 'password',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
