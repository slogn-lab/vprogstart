import { describe, it, expect, test } from 'vitest'
import {createBook, User, Book,calculateArea} from '../main/main'
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
describe('createBooktest',()=>{
    describe.each([
        {
            name: 'all',
            input:{title: "Война и мир",author: "Лев Толстой",year: 1869,genre: "fiction"},
            expected:{title: "Война и мир",author: "Лев Толстой",year: 1869,genre: "fiction"}
        },
        {
            name: 'not-all',
            input:{title: "Преступление и наказание",author: "Федор Достоевский",genre: "fiction"},
            expected:{title: "Преступление и наказание",author: "Федор Достоевский",year:undefined,genre: "fiction"}
        },
        {
            name: 'other-variant',
            input:{title: "Краткая история времени",author: "Стивен Хокинг",year: 1988,genre: "non-fiction"},
            expected:{title: "Краткая история времени",author: "Стивен Хокинг",year: 1988,genre: "non-fiction"}
        }
    ])('createBook $name', ({ input, expected }) => {
    it('should return correct book object', () => {
      const result = createBook(input as Book)
      expect(result).toEqual(expected)
    })
  })
})
//test 3
describe('calculateArea', () => {
  // ============= ТЕСТЫ ДЛЯ КРУГА =============
  describe('circle calculations', () => {
    // Тест 1: Площадь круга с положительным радиусом
    it('should calculate area of circle with positive radius', () => {
      const radius = 5
      const expected = Math.PI * Math.pow(radius, 2)
      const result = calculateArea('circle', radius)
      expect(result).toBeCloseTo(expected, 10) // toBeCloseTo для чисел с плавающей точкой
    })

    // Тест 2: Площадь круга с радиусом 0
    it('should return 0 for circle with radius 0', () => {
      const result = calculateArea('circle', 0)
      expect(result).toBe(0)
    })
    // Тест 3: Площадь круга с дробным радиусом
    it('should handle fractional radius', () => {
      const result = calculateArea('circle', 2.5)
      const expected = Math.PI * Math.pow(2.5, 2)
      expect(result).toBeCloseTo(expected, 10)
    })
  })
  describe('square calculations', () => {
    // Тест 4: Площадь квадрата с положительной стороной
    it('should calculate area of square with positive side', () => {
      const side = 4
      const expected = Math.pow(side, 2)
      const result = calculateArea('square', side)
      expect(result).toBe(expected)
    })

    // Тест 5: Площадь квадрата со стороной 0
    it('should return 0 for square with side 0', () => {
      const result = calculateArea('square', 0)
      expect(result).toBe(0)
    })
    // Тест 6: Площадь квадрата с дробной стороной
    it('should handle fractional side length', () => {
      const result = calculateArea('square', 3.7)
      const expected = Math.pow(3.7, 2)
      expect(result).toBeCloseTo(expected, 10)
    })
  })
})