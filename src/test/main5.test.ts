import { describe, it, expect } from 'vitest';
import {
    validateQueryOrder,
  query,
  where,
  groupBy,
  having,
  sort,
  type Group,
  type Transform,
  type GroupTransform,
  type WhereStage,
  type GroupByStage,
  type HavingStage,
  type SortStage,
  type QueryStage
} from '../main/main5';

describe('Query System Tests', () => {
  interface User {
    id: number;
    name: string;
    age: number;
    city: string;
    isActive: boolean;
  }

  const testData: User[] = [
    { id: 1, name: 'Alice', age: 30, city: 'New York', isActive: true},
    { id: 2, name: 'Bob', age: 25, city: 'Los Angeles', isActive: true},
    { id: 3, name: 'Charlie', age: 35, city: 'New York', isActive: false},
    { id: 4, name: 'David', age: 30, city: 'Chicago', isActive: true},
    { id: 5, name: 'Eve', age: 28, city: 'New York', isActive: true},
  ];

  describe('where operations', () => {
    it('should filter by single condition', () => {
      const q = query<User>(
        where('city', 'New York')
      );
      
      const result = q(testData);
      expect(result).toHaveLength(3);
      expect(result.every(user => (user as User).city === 'New York')).toBe(true);
    });

    it('should filter by multiple conditions', () => {
      const q = query<User>(
        where('city', 'New York'),
        where('isActive', true)
      );
      
      const result = q(testData);
      expect(result).toHaveLength(2);
      expect(result.every(user => (user as User).city === 'New York' && (user as User).isActive)).toBe(true);
    });
  });

  describe('sort operations', () => {
    it('should sort by age ascending', () => {
      const q = query<User>(
        sort('age', 'asc')
      );
      
      const result = q(testData);
      const users = result as User[];
      for (let i = 1; i < users.length; i++) {
        expect(users[i].age).toBeGreaterThanOrEqual(users[i-1].age);
      }
    });

    it('should sort by age descending', () => {
      const q = query<User>(
        sort('age', 'desc')
      );
      
      const result = q(testData);
      const users = result as User[];
      for (let i = 1; i < users.length; i++) {
        expect(users[i].age).toBeLessThanOrEqual(users[i-1].age);
      }
    });

    it('should sort after where filter', () => {
      const q = query<User>(
        where('city', 'New York'),
        sort('age', 'asc')
      );
      
      const result = q(testData);
      const users = result as User[];
      expect(users.every(user => user.city === 'New York')).toBe(true);
      for (let i = 1; i < users.length; i++) {
        expect(users[i].age).toBeGreaterThanOrEqual(users[i-1].age);
      }
    });
  });

  describe('groupBy operations', () => {
    it('should group by city', () => {
      const q = query<User>(
        groupBy('city')
      );
      
      const result = q(testData);
      const groups = result as Group<User, any>[];
      
      groups.forEach(group => {
        expect(group).toHaveProperty('key');
        expect(group).toHaveProperty('items');
        expect(Array.isArray(group.items)).toBe(true);
        group.items.forEach(item => {
          expect(item.city).toBe(group.key);
        });
      });
    });

    it('should group by age', () => {
      const q = query<User>(
        groupBy('age')
      );
      
      const result = q(testData);
      const groups = result as Group<User, any>[];
      
      groups.forEach(group => {
        expect(typeof group.key).toBe('number');
        expect(Array.isArray(group.items)).toBe(true);
        group.items.forEach(item => {
          expect(item.age).toBe(group.key);
        });
      });
    });
  });

  describe('having operations', () => {
    it('should filter groups with more than 1 item', () => {
      const q = query<User>(
        groupBy('city'),
        having(group => group.items.length > 1)
      );
      
      const result = q(testData);
      const groups = result as Group<User, any>[];
      
      expect(groups.length).toBeGreaterThan(0);
      groups.forEach(group => {
        expect(group.items.length).toBeGreaterThan(1);
      });
    });

    it('should filter groups with specific condition', () => {
      const q = query<User>(
        groupBy('city'),
        having(group => group.items.some(u => u.isActive))
      );
      
      const result = q(testData);
      const groups = result as Group<User,any>[];
      
      groups.forEach(group => {
        expect(group.items.some(u => u.isActive)).toBe(true);
      });
    });
  });

  describe('combined operations', () => {
    it('should perform where -> groupBy -> having -> sort on groups', () => {
      const q = query<User>(
        where('isActive', true),
        groupBy('city'),
        having(group => group.items.length >= 1)
        // sort('key', 'asc') - убрано, так как key не является полем User
      );
      
      const result = q(testData);
      const groups = result as Group<User, any>[];
      
      groups.forEach(group => {
        expect(Array.isArray(group.items)).toBe(true);
        group.items.forEach(user => {
          expect(user.isActive).toBe(true);
        });
      });
    });

    it('should handle complex scenario', () => {
      const q = query<User>(
        where('isActive', true),
        groupBy('city'),
        having(group => group.items.length > 0)
      );
      
      const result = q(testData);
      const groups = result as Group<User, any>[];
      
      const expectedUsers = testData.filter(u => u.isActive);
      const expectedCities = [...new Set(expectedUsers.map(u => u.city))];
      
      expect(groups.map(g => g.key)).toEqual(expect.arrayContaining(expectedCities));
      
      groups.forEach(group => {
        group.items.forEach(user => {
          expect(user.isActive).toBe(true);
        });
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty array', () => {
      const q = query<User>(
        where('age', 30),
        sort('name', 'asc')
      );
      
      const result = q([]);
      expect(result).toHaveLength(0);
    });

    it('should handle single operation', () => {
      const q = query<User>(
        sort('id', 'desc')
      );
      
      const result = q(testData);
      const users = result as User[];
      expect(users[0].id).toBe(5);
      expect(users[users.length-1].id).toBe(1);
    });

    it('should handle groupBy on empty array', () => {
      const q = query<User>(
        groupBy('city')
      );
      
      const result = q([]);
      const groups = result as Group<User, any>[];
      expect(groups).toHaveLength(0);
    });

    it('should preserve original data structure in where/sort', () => {
      const q = query<User>(
        where('isActive', true),
        sort('id', 'asc')
      );
      
      const result = q(testData);
      const users = result as User[];
      users.forEach(user => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('age');
        expect(user).toHaveProperty('city');
        expect(user).toHaveProperty('isActive');
      });
    });

    it('should preserve group structure in groupBy/having', () => {
      const q = query<User>(
        groupBy('city'),
        having(group => group.items.length > 0)
      );
      
      const result = q(testData);
      const groups = result as Group<User, any>[];
      
      groups.forEach(group => {
        expect(group).toHaveProperty('key');
        expect(group).toHaveProperty('items');
        expect(Array.isArray(group.items)).toBe(true);
      });
    });
  });
});
describe('validateQueryOrder', () => {
  interface TestUser {
    id: number;
    name: string;
    age: number;
  }

  describe('valid orders', () => {
    it('should accept empty stages', () => {
      const result = validateQueryOrder<TestUser>();
      expect(result).toBe(true);
    });

    it('should accept single where stage', () => {
      const stages: QueryStage<TestUser>[] = [
        where('age', 25)
      ];
      const result = validateQueryOrder<TestUser>(...stages);
      expect(result).toBe(true);
    });

    it('should accept multiple where stages', () => {
      const stages: QueryStage<TestUser>[] = [
        where('age', 25),
        where('name', 'John'),
        where('id', 1)
      ];
      const result = validateQueryOrder<TestUser>(...stages);
      expect(result).toBe(true);
    });

    it('should accept where followed by groupBy', () => {
      const stages: QueryStage<TestUser>[] = [
        where('age', 25),
        groupBy('age')
      ];
      const result = validateQueryOrder<TestUser>(...stages);
      expect(result).toBe(true);
    });

    it('should accept where, groupBy, having', () => {
      const stages: QueryStage<TestUser>[] = [
        where('age', 25),
        groupBy('age'),
        having(group => group.items.length > 0)
      ];
      const result = validateQueryOrder<TestUser>(...stages);
      expect(result).toBe(true);
    });

    it('should accept where, groupBy, having, sort', () => {
      const stages: QueryStage<TestUser>[] = [
        where('age', 25),
        groupBy('age'),
        having(group => group.items.length > 0),
        sort('age', 'asc')
      ];
      const result = validateQueryOrder<TestUser>(...stages);
      expect(result).toBe(true);
    });

    it('should accept where, groupBy, sort', () => {
      const stages: QueryStage<TestUser>[] = [
        where('age', 25),
        groupBy('age'),
        sort('age', 'asc')
      ];
      const result = validateQueryOrder<TestUser>(...stages);
      expect(result).toBe(true);
    });

    it('should accept multiple groupBy stages', () => {
      const stages: QueryStage<TestUser>[] = [
        groupBy('age'),
        groupBy('name')
      ];
      const result = validateQueryOrder<TestUser>(...stages);
      expect(result).toBe(true);
    });

    it('should accept multiple having stages', () => {
      const stages: QueryStage<TestUser>[] = [
        groupBy('age'),
        having(group => group.items.length > 0),
        having(group => group.items.length < 10)
      ];
      const result = validateQueryOrder<TestUser>(...stages);
      expect(result).toBe(true);
    });

    it('should accept complex valid order with all operations', () => {
      const stages: QueryStage<TestUser>[] = [
        where('age', 25),
        where('name', 'John'),
        groupBy('age'),
        groupBy('name'),
        having(group => group.items.length > 0),
        having(group => group.items.length < 10),
        sort('age', 'asc'),
        sort('name', 'desc')
      ];
      const result = validateQueryOrder<TestUser>(...stages);
      expect(result).toBe(true);
    });
  });

  describe('invalid orders', () => {
    it('should reject groupBy before where', () => {
      const stages: QueryStage<TestUser>[] = [
        groupBy('age'),
        where('age', 25)
      ];
      const result = validateQueryOrder<TestUser>(...stages);
      expect(result).toBe(false);
    });

    it('should reject having before groupBy', () => {
      const stages: QueryStage<TestUser>[] = [
        having(group => group.items.length > 0),
        groupBy('age')
      ];
      const result = validateQueryOrder<TestUser>(...stages);
      expect(result).toBe(false);
    });

    it('should reject sort before where', () => {
      const stages: QueryStage<TestUser>[] = [
        sort('age', 'asc'),
        where('age', 25)
      ];
      const result = validateQueryOrder<TestUser>(...stages);
      expect(result).toBe(false);
    });

    it('should reject sort before groupBy', () => {
      const stages: QueryStage<TestUser>[] = [
        sort('age', 'asc'),
        groupBy('age')
      ];
      const result = validateQueryOrder<TestUser>(...stages);
      expect(result).toBe(false);
    });

    it('should reject sort before having', () => {
      const stages: QueryStage<TestUser>[] = [
        groupBy('age'),
        sort('age', 'asc'),
        having(group => group.items.length > 0)
      ];
      const result = validateQueryOrder<TestUser>(...stages);
      expect(result).toBe(false);
    });

    it('should reject where after groupBy', () => {
      const stages: QueryStage<TestUser>[] = [
        groupBy('age'),
        where('age', 25)
      ];
      const result = validateQueryOrder<TestUser>(...stages);
      expect(result).toBe(false);
    });

    it('should reject where after having', () => {
      const stages: QueryStage<TestUser>[] = [
        groupBy('age'),
        having(group => group.items.length > 0),
        where('age', 25)
      ];
      const result = validateQueryOrder<TestUser>(...stages);
      expect(result).toBe(false);
    });

    it('should reject where after sort', () => {
      const stages: QueryStage<TestUser>[] = [
        sort('age', 'asc'),
        where('age', 25)
      ];
      const result = validateQueryOrder<TestUser>(...stages);
      expect(result).toBe(false);
    });

    it('should reject groupBy after having', () => {
      const stages: QueryStage<TestUser>[] = [
        groupBy('age'),
        having(group => group.items.length > 0),
        groupBy('name')
      ];
      const result = validateQueryOrder<TestUser>(...stages);
      expect(result).toBe(false);
    });

    it('should reject groupBy after sort', () => {
      const stages: QueryStage<TestUser>[] = [
        sort('age', 'asc'),
        groupBy('age')
      ];
      const result = validateQueryOrder<TestUser>(...stages);
      expect(result).toBe(false);
    });

    it('should reject having after sort', () => {
      const stages: QueryStage<TestUser>[] = [
        groupBy('age'),
        sort('age', 'asc'),
        having(group => group.items.length > 0)
      ];
      const result = validateQueryOrder<TestUser>(...stages);
      expect(result).toBe(false);
    });

    it('should reject interleaved invalid order', () => {
      const stages: QueryStage<TestUser>[] = [
        where('age', 25),
        groupBy('age'),
        where('name', 'John'), // where после groupBy - недопустимо
        having(group => group.items.length > 0),
        sort('age', 'asc')
      ];
      const result = validateQueryOrder<TestUser>(...stages);
      expect(result).toBe(false);
    });

    it('should reject having without preceding groupBy', () => {
      const stages: QueryStage<TestUser>[] = [
        where('age', 25),
        having(group => group.items.length > 0) // having без groupBy
      ];
      const result = validateQueryOrder<TestUser>(...stages);
      expect(result).toBe(false);
    });
  });
})