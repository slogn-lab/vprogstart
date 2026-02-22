import { describe, it, expect, test } from 'vitest'
import {User} from '../main/main'
import createUsers from '../main/main'
//test 1
describe('createUsers parameterized tests', () => {
  describe.each([
    {
      name: 'with all fields',
      input: { id: 1, name: 'John', email: 'john@test.com', isActive: true },
      expected: { id: 1, name: 'John', email: 'john@test.com', isActive: true }
    },
    {
      name: 'without email',
      input: { id: 2, name: 'Jane', isActive: false },
      expected: { id: 2, name: 'Jane', email: undefined, isActive: false }
    },
    {
      name: 'without isActive',
      input: { id: 3, name: 'Bob', email: 'bob@test.com' },
      expected: { id: 3, name: 'Bob', email: 'bob@test.com', isActive: true }
    },
    {
      name: 'with only required fields',
      input: { id: 4, name: 'Alice' },
      expected: { id: 4, name: 'Alice', email: undefined, isActive: true }
    }
  ])('createUsers $name', ({ input, expected }) => {
    it('should return correct user object', () => {
      const result = createUsers(input as User)
      expect(result).toEqual(expected)
    })
  })
})
//test 2