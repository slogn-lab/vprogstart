import {
  Transform,
  Where,
  Sort,
  Group,
  GroupBy,
  GroupTransform,
  Having,
  query
} from '../main/main4'; 

// Тестовые типы данных
interface User {
  id: number;
  name: string;
  city: string;
  age: number;
  isActive: boolean;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
}

// Тестовые данные
const users: User[] = [
  { id: 1, name: 'Alice', city: 'Moscow', age: 25, isActive: true },
  { id: 2, name: 'Bob', city: 'SPb', age: 30, isActive: false },
  { id: 3, name: 'Charlie', city: 'Moscow', age: 35, isActive: true },
  { id: 4, name: 'David', city: 'SPb', age: 28, isActive: true },
  { id: 5, name: 'Eve', city: 'Kazan', age: 22, isActive: false },
  { id: 6, name: 'Frank', city: 'Moscow', age: 40, isActive: true },
  { id: 7, name: 'Grace', city: 'Kazan', age: 27, isActive: true },
  { id: 8, name: 'Henry', city: 'SPb', age: 33, isActive: false }
];

const products: Product[] = [
  { id: 1, name: 'Laptop', category: 'Electronics', price: 1000, inStock: true },
  { id: 2, name: 'Mouse', category: 'Electronics', price: 50, inStock: true },
  { id: 3, name: 'Book', category: 'Books', price: 20, inStock: false },
  { id: 4, name: 'Desk', category: 'Furniture', price: 300, inStock: true },
  { id: 5, name: 'Chair', category: 'Furniture', price: 150, inStock: false },
  { id: 6, name: 'Keyboard', category: 'Electronics', price: 80, inStock: true },
  { id: 7, name: 'Notebook', category: 'Books', price: 5, inStock: true },
  { id: 8, name: 'Lamp', category: 'Furniture', price: 45, inStock: true }
];

// Реализация функций для тестирования
const where: Where<User> = (key, value) => (array) => 
  array.filter(item => item[key] === value);

const whereProduct: Where<Product> = (key, value) => (array) => 
  array.filter(item => item[key] === value);

const sort: Sort<User> = (key) => (array) => 
  [...array].sort((a, b) => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  });

const sortProduct: Sort<Product> = (key) => (array) => 
  [...array].sort((a, b) => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  });


// Создаем реализацию GroupBy
const groupBy: GroupBy<User> = (key) => {
  return (groups: Group<User, typeof key>[]) => {
    
    return groups;
  };
};

const createCityGroups = (): Group<User, 'city'>[] => {
  const cityMap = new Map<string, User[]>();
  users.forEach(user => {
    if (!cityMap.has(user.city)) {
      cityMap.set(user.city, []);
    }
    cityMap.get(user.city)!.push(user);
  });
  
  return Array.from(cityMap.entries()).map(([city, items]) => ({
    key: city,
    items
  }));
};

const createActiveGroups = (): Group<User, 'isActive'>[] => {
  const activeMap = new Map<boolean, User[]>();
  users.forEach(user => {
    if (!activeMap.has(user.isActive)) {
      activeMap.set(user.isActive, []);
    }
    activeMap.get(user.isActive)!.push(user);
  });
  
  return Array.from(activeMap.entries()).map(([isActive, items]) => ({
    key: isActive,
    items
  }));
};

const createCategoryGroups = (): Group<Product, 'category'>[] => {
  const categoryMap = new Map<string, Product[]>();
  products.forEach(product => {
    if (!categoryMap.has(product.category)) {
      categoryMap.set(product.category, []);
    }
    categoryMap.get(product.category)!.push(product);
  });
  
  return Array.from(categoryMap.entries()).map(([category, items]) => ({
    key: category,
    items
  }));
};

const cityGroups = createCityGroups();
const activeGroups = createActiveGroups();
const categoryGroups = createCategoryGroups();

// GroupTransform реализации
const filterLargeGroups: GroupTransform<User, 'city'> = (groups) => 
  groups.filter(g => g.items.length >= 3);

const sortGroupsBySize: GroupTransform<User, 'city'> = (groups) => 
  [...groups].sort((a, b) => b.items.length - a.items.length);

const filterInStockGroups: GroupTransform<Product, 'category'> = (groups) => 
  groups.filter(g => g.items.some(p => p.inStock));

// Having реализации
const having: Having<User> = (predicate) => (groups) => 
  groups.filter(predicate);

const havingProduct: Having<Product> = (predicate) => (groups) => 
  groups.filter(predicate);

// ==================== ТЕСТЫ ====================

describe('Type Tests', () => {
  
  // Тест 1: Transform<T>
  describe('Transform<T>', () => {
    test('should transform array of users', () => {
      const transformDoubleAge: Transform<User> = (array) => 
        array.map(user => ({ ...user, age: user.age * 2 }));
      
      const result = transformDoubleAge([users[0], users[1]]);
      
      expect(result).toHaveLength(2);
      expect(result[0].age).toBe(50); // 25 * 2
      expect(result[1].age).toBe(60); // 30 * 2
    });

    test('should transform array of products', () => {
      const transformAddTax: Transform<Product> = (array) => 
        array.map(product => ({ ...product, price: Math.round(product.price * 1.2 * 100) / 100 }));
      
      const result = transformAddTax([products[0], products[1]]);
      
      expect(result).toHaveLength(2);
      expect(result[0].price).toBe(1200); // 1000 * 1.2
      expect(result[1].price).toBe(60); // 50 * 1.2
    });
  });

  // Тест 2: Where<T>
  describe('Where<T>', () => {
    test('should filter users by city', () => {
      const filterByCity = where('city', 'Moscow');
      const result = filterByCity(users);
      
      expect(result).toHaveLength(3);
      result.forEach(user => expect(user.city).toBe('Moscow'));
    });

    test('should filter users by isActive', () => {
      const filterByActive = where('isActive', true);
      const result = filterByActive(users);
      
      expect(result).toHaveLength(5); // Alice, Charlie, David, Frank, Grace
      result.forEach(user => expect(user.isActive).toBe(true));
    });

    test('should filter products by category', () => {
      const filterByCategory = whereProduct('category', 'Electronics');
      const result = filterByCategory(products);
      
      expect(result).toHaveLength(3); // Laptop, Mouse, Keyboard
      result.forEach(product => expect(product.category).toBe('Electronics'));
    });

    test('should filter products by inStock', () => {
      const filterByStock = whereProduct('inStock', true);
      const result = filterByStock(products);
      
      expect(result).toHaveLength(6); // все кроме Book и Chair
      result.forEach(product => expect(product.inStock).toBe(true));
    });
  });

  // Тест 3: Sort<T>
  describe('Sort<T>', () => {
    test('should sort users by name', () => {
      const sortByName = sort('name');
      const testUsers = users.slice(0, 4);
      const result = sortByName(testUsers);
      
      expect(result[0].name).toBe('Alice');
      expect(result[1].name).toBe('Bob');
      expect(result[2].name).toBe('Charlie');
      expect(result[3].name).toBe('David');
    });

    test('should sort users by age', () => {
      const sortByAge = sort('age');
      const testUsers = users.slice(0, 4);
      const result = sortByAge(testUsers);
      
      expect(result[0].age).toBe(25); // Alice
      expect(result[1].age).toBe(28); // David
      expect(result[2].age).toBe(30); // Bob
      expect(result[3].age).toBe(35); // Charlie
    });

    test('should sort products by price', () => {
      const sortByPrice = sortProduct('price');
      const testProducts = products.slice(0, 4);
      const result = sortByPrice(testProducts);
      
      expect(result[0].price).toBe(20);  // Book
      expect(result[1].price).toBe(50);  // Mouse
      expect(result[2].price).toBe(300); // Desk
      expect(result[3].price).toBe(1000); // Laptop
    });
  });

  // Тест 4: Group<T, K>
  describe('Group<T, K>', () => {
    test('should create valid user group', () => {
      const moscowGroup: Group<User, 'city'> = {
        key: 'Moscow',
        items: users.filter(u => u.city === 'Moscow')
      };
      
      expect(moscowGroup.key).toBe('Moscow');
      expect(moscowGroup.items).toHaveLength(3);
      expect(moscowGroup.items[0].name).toBe('Alice');
    });

    test('should create valid product group', () => {
      const electronicsGroup: Group<Product, 'category'> = {
        key: 'Electronics',
        items: products.filter(p => p.category === 'Electronics')
      };
      
      expect(electronicsGroup.key).toBe('Electronics');
      expect(electronicsGroup.items).toHaveLength(3);
      expect(electronicsGroup.items[0].name).toBe('Laptop');
    });
  });

  // Тест 5: GroupBy<T> (исправленный с учетом типов)
  describe('GroupBy<T>', () => {
    test('should create groupBy function that returns Transform<Group<User, K>>', () => {
      // GroupBy<User> возвращает функцию, которая принимает ключ
      const groupByCityFunc = groupBy('city');
      
      // groupByCityFunc - это Transform<Group<User, 'city'>>
      // То есть функция, которая принимает Group<User, 'city'>[] и возвращает Group<User, 'city'>[]
      
      // Подготавливаем тестовые группы
      const testGroups: Group<User, 'city'>[] = [
        { key: 'Moscow', items: users.filter(u => u.city === 'Moscow') },
        { key: 'SPb', items: users.filter(u => u.city === 'SPb') }
      ];
      
      // Применяем Transform к группам
      const result = groupByCityFunc(testGroups);
      
      // Проверяем, что Transform вернул те же группы (в нашей реализации)
      expect(result).toEqual(testGroups);
      expect(result).toHaveLength(2);
    });

    test('GroupBy should work with different key types', () => {
      const groupByActiveFunc = groupBy('isActive');
      
      const testGroups: Group<User, 'isActive'>[] = [
        { key: true, items: users.filter(u => u.isActive) },
        { key: false, items: users.filter(u => !u.isActive) }
      ];
      
      const result = groupByActiveFunc(testGroups);
      expect(result).toHaveLength(2);
    });
  });

  // Тест 6: GroupTransform<T, K>
  describe('GroupTransform<T, K>', () => {
    test('should filter groups with >= 3 items', () => {
      const result = filterLargeGroups(cityGroups);
      
      expect(result).toHaveLength(2); // Moscow и SPb (по 3 пользователя)
      expect(result[0].key).toBe('Moscow');
      expect(result[1].key).toBe('SPb');
    });

    test('should sort groups by size descending', () => {
      const result = sortGroupsBySize(cityGroups);
      
      expect(result[0].key).toBe('Moscow'); // 3 пользователя
      expect(result[1].key).toBe('SPb');    // 3 пользователя
      expect(result[2].key).toBe('Kazan');  // 2 пользователя
    });

    test('should filter product groups with items in stock', () => {
      const result = filterInStockGroups(categoryGroups);
      
      expect(result).toHaveLength(3); // все категории имеют товары в наличии
      result.forEach(group => {
        expect(group.items.some(p => p.inStock)).toBe(true);
      });
    });
  });

  // Тест 7: Having<T>
  describe('Having<T>', () => {
    test('should filter groups with min users count', () => {
      const hasMinUsers = (min: number) => (group: Group<User, 'city'>) => 
        group.items.length >= min;
      
      const havingMinUsers = having(hasMinUsers(3));
      const result = havingMinUsers(cityGroups);
      
      expect(result).toHaveLength(2); // Moscow и SPb
      expect(result[0].items.length).toBeGreaterThanOrEqual(3);
    });

    test('should filter groups by average age', () => {
      const hasAvgAgeOver = (age: number) => (group: Group<User, 'city'>) => {
        const avg = group.items.reduce((sum, u) => sum + u.age, 0) / group.items.length;
        return avg > age;
      };
      
      const havingAvgAge = having(hasAvgAgeOver(28));
      const result = havingAvgAge(cityGroups);
      
      // SPb: (30+28+33)/3 = 30.33 > 28
      // Moscow: (25+35+40)/3 = 33.33 > 28
      // Kazan: (22+27)/2 = 24.5 < 28
      expect(result).toHaveLength(2);
      expect(result.map(g => g.key)).not.toContain('Kazan');
    });

    test('should filter product groups by total value', () => {
      const hasTotalOver = (value: number) => (group: Group<Product, 'category'>) => {
        const total = group.items.reduce((sum, p) => sum + p.price, 0);
        return total > value;
      };
      
      const havingTotalOver = havingProduct(hasTotalOver(200));
      const result = havingTotalOver(categoryGroups);
      
      // Electronics: 1000+50+80 = 1130 > 200
      // Furniture: 300+150+45 = 495 > 200
      // Books: 20+5 = 25 < 200
      expect(result).toHaveLength(2);
      expect(result.map(g => g.key)).not.toContain('Books');
    });
  });

  // Тест 8: query()
  describe('query()', () => {
    test('should chain Transform steps', () => {
      const whereActive: Transform<User> = (arr) => arr.filter(u => u.isActive);
      const sortByAge: Transform<User> = (arr) => [...arr].sort((a, b) => a.age - b.age);
      
      const query1 = query<User>(whereActive, sortByAge);
      const result = query1(users);
      
      expect(result).toHaveLength(5); // только активные
      expect(result[0].age).toBe(25); // Alice
      expect(result[1].age).toBe(27); // Grace
      expect(result[2].age).toBe(28); // David
      expect(result[3].age).toBe(35); // Charlie
      expect(result[4].age).toBe(40); // Frank
    });

    test('should work with products query', () => {
      const cheapProducts: Transform<Product> = (arr) => arr.filter(p => p.price < 100);
      const inStock: Transform<Product> = (arr) => arr.filter(p => p.inStock);
      const sortByPrice: Transform<Product> = (arr) => [...arr].sort((a, b) => a.price - b.price);
      
      const query3 = query<Product>(cheapProducts, inStock, sortByPrice);
      const result = query3(products);
      
      expect(result).toHaveLength(4); // Mouse(50), Notebook(5), Lamp(45), Keyboard(80) - все <100 и в наличии
      expect(result[0].price).toBe(5);  // Notebook
      expect(result[1].price).toBe(45); // Lamp
      expect(result[2].price).toBe(50); // Mouse
      expect(result[3].price).toBe(80); // Keyboard
    });
  });

  // Тест 9: Интеграционные тесты
  describe('Integration Tests', () => {
    test('complex user query with where, groupBy, having', () => {
      const whereActive: Transform<User> = (arr) => arr.filter(u => u.isActive);
      const groupByCityFunc = (groups: Group<User, 'city'>[]) => groups;
      const havingLargeGroups: Having<User> = (predicate) => (groups) => groups.filter(predicate);
      
      const havingMinSize = havingLargeGroups((g: Group<User, 'city'>) => g.items.length >= 2);
      
      const query = (data: User[]) => {
        const active = whereActive(data);
        
        // Создаем группы вручную
        const groups: Group<User, 'city'>[] = [];
        const cityMap = new Map<string, User[]>();
        active.forEach(u => {
          if (!cityMap.has(u.city)) cityMap.set(u.city, []);
          cityMap.get(u.city)!.push(u);
        });
        cityMap.forEach((items, key) => groups.push({ key, items }));
        
        const filteredGroups = havingMinSize(groups);
        return filteredGroups;
      };
      
      const result = query(users);
      
      expect(result).toHaveLength(1); 
      expect(result.find(g => g.key === 'Kazan')).toBeUndefined(); // Kazan имеет только 1 активного (Grace)
    });

    test('complex product query', () => {
      const electronics = whereProduct('category', 'Electronics');
      const inStock = whereProduct('inStock', true);
      
      const query = (data: Product[]) => {
        const e = electronics(data);
        const inStockProducts = inStock(e);
        return inStockProducts.sort((a, b) => a.price - b.price);
      };
      
      const result = query(products);
      
      expect(result).toHaveLength(3); // Mouse, Keyboard, Laptop (все Electronics в наличии)
      expect(result[0].name).toBe('Mouse');
      expect(result[1].name).toBe('Keyboard');
      expect(result[2].name).toBe('Laptop');
    });
  });
});