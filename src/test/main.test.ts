import { describe, it, expect, test } from 'vitest'
import {createBook, User, Book,calculateArea,Status,getStatusColor,statuses,StringFormatter,capitalizeFirstLetter,trimAndTransform, getFirstElement,HasId,findById} from '../main/main'
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
//test 4
describe('Status Color Functions', () => {
  // ============= ТЕСТЫ ДЛЯ getStatusColor =============
  describe('getStatusColor', () => {
    // Тест 1: Получение цвета для активного статуса
    it('should return "green" for active status', () => {
      const result = getStatusColor('active')
      expect(result).toBe('green')
    })

    // Тест 2: Получение цвета для неактивного статуса
    it('should return "gray" for inactive status', () => {
      const result = getStatusColor('inactive')
      expect(result).toBe('gray')
    })

    // Тест 3: Получение цвета для нового статуса
    it('should return "blue" for new status', () => {
      const result = getStatusColor('new')
      expect(result).toBe('blue')
    })

    // Тест 4: Проверка всех статусов через параметризацию
    it.each([
      ['active', 'green'],
      ['inactive', 'gray'],
      ['new', 'blue']
    ])('should return "%s" for %s status', (status, expectedColor) => {
      const result = getStatusColor(status as Status)
      expect(result).toBe(expectedColor)
    })

    // Тест 5: Проверка возвращаемого типа
    it('should always return a string', () => {
      statuses.forEach(status => {
        const result = getStatusColor(status)
        expect(typeof result).toBe('string')
      })
    })
  })
})
//test 5
describe('String Formatters', () => {
  describe('capitalizeFirstLetter', () => {
    const testCases = [
      { input: 'hello', uppercase: false, expected: 'Hello' },
      { input: 'HELLO', uppercase: false, expected: 'Hello' },
      { input: 'hello', uppercase: true, expected: 'HELLO' },
      { input: '', uppercase: false, expected: '' },
      { input: 'a', uppercase: false, expected: 'A' },
      { input: '  hello', uppercase: false, expected: '  hello' },
      { input: '123abc', uppercase: false, expected: '123abc' },
      { input: 'the QUICK brown', uppercase: false, expected: 'The quick brown' },
    ]

    testCases.forEach(({ input, uppercase, expected }) => {
      it(`should return "${expected}" for "${input}" with uppercase=${uppercase}`, () => {
        expect(capitalizeFirstLetter(input, uppercase)).toBe(expected)
      })
    })
  })

  describe('trimAndTransform', () => {
    const testCases = [
      { input: '  hello  ', uppercase: false, expected: 'hello' },
      { input: '  hello  ', uppercase: true, expected: 'HELLO' },
      { input: '', uppercase: false, expected: '' },
      { input: '   ', uppercase: false, expected: '' },
      { input: 'hello', uppercase: false, expected: 'hello' },
      { input: 'hello', uppercase: true, expected: 'HELLO' },
      { input: '\n\t test \t\n', uppercase: false, expected: 'test' },
      { input: '  multi  word  ', uppercase: false, expected: 'multi  word' },
    ]

    testCases.forEach(({ input, uppercase, expected }) => {
      it(`should return "${expected}" for "${input}" with uppercase=${uppercase}`, () => {
        expect(trimAndTransform(input, uppercase)).toBe(expected)
      })
    })
  })
})
//test 6
describe('firstelementtest',()=>{
  const testCases = [
    {input:[1,2,5,6],expected:1},
    {input:['a','b','f','e'],expected:'a'},
    {input:[],expected:undefined}
  ]
  testCases.forEach(({ input,expected}) =>{
    it('should return "${expected}" for "${input}" ',()=>{
      expect(getFirstElement(input as any)).toBe(expected)
    })
  })
    })
  //test 7
  describe('findById', () => {
  const testItems = [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Orange' }
  ]

  it('находит существующий элемент', () => {
    expect(findById(testItems, 2)).toEqual({ id: 2, name: 'Banana' })
  })

  it('возвращает undefined для несуществующего id', () => {
    expect(findById(testItems, 99)).toBeUndefined()
  })

  it('работает с пустым массивом', () => {
    expect(findById([], 1)).toBeUndefined()
  })

  it('возвращает первый найденный при дубликатах', () => {
    const duplicates = [
      { id: 1, name: 'First' },
      { id: 1, name: 'Second' }
    ]
    expect(findById(duplicates, 1)).toEqual({ id: 1, name: 'First' })
  })

  it('работает с разными типами объектов', () => {
    const users = [
      { id: 1, username: 'john' },
      { id: 2, username: 'jane' }
    ]
    expect(findById(users, 2)).toEqual({ id: 2, username: 'jane' })
  })
})