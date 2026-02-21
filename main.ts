//1 задача
interface User{
    id:number;
    name:string;
    email?:string;
    isActive?:boolean;
}
function createUsers(params:User): User {
    return{
        id: params.id,
        name: params.name,
        email: params.email,
        isActive: params.isActive ?? true
    };
}
//тест работоспособности
const user1 = createUsers({
    id: 1,
    name: "Иван Петров",
    email: "ivan@example.com"
})
console.log(user1,"\n"); 
const user2 = createUsers({
    id: 2,
    name: "Петр Сидоров",
    isActive: false
});
console.log(user2,"\n");
//2 задача
interface Book{
    title:string;
    author:string;
    year?:number;
    genre:'fiction' | 'non-fiction';
}
function createBook(book: Book): Book{
    return book;
}
//тест работоспособности
const book1: Book = {
    title: "Война и мир",
    author: "Лев Толстой",
    year: 1869,
    genre: "fiction"
};
const createdBook1 = createBook(book1);
console.log("Книга 1 (со всеми полями):", createdBook1,"\n");
const book3: Book = {
    title: "Преступление и наказание",
    author: "Федор Достоевский",
    genre: "fiction"
};
const createdBook3 = createBook(book3);
console.log("Книга 2 (без year):", createdBook3,"\n");
const nonFictionBook: Book = {
    title: "Краткая история времени",
    author: "Стивен Хокинг",
    year: 1988,
    genre: "non-fiction"
};

console.log("Художественная книга:", createBook(book1),"\n");
console.log("Нон-фикшн книга:", createBook(nonFictionBook),"\n");
//3 задача
function calculateArea(shape: 'circle', radius: number): number;
function calculateArea(shape: 'square', side: number): number;

function calculateArea(shape:'circle'|'square',param:number): number{
    switch(shape){
        case 'circle':
            return Math.PI * Math.pow(param, 2);
        case 'square':
            return Math.pow(param, 2);
        default:
            throw new Error('Неподдерживаемая фигура');
    }
}
//тест работоспособности
const circleArea1 = calculateArea('circle', 5);
console.log(`Круг с радиусом 5: ${circleArea1.toFixed(2)}\n`);
const squareArea1 = calculateArea('square', 4);
console.log(`Квадрат со стороной 4: ${squareArea1}\n`); 
//4 задача
type Status = 'active' | 'inactive' | 'new';
const statusColorMap: Record<Status, string> = {
    'active': 'green',
    'inactive': 'gray',
    'new': 'blue'
};

function getStatusColor(status: Status): string {
    return statusColorMap[status];
}

const statuses: Status[] = ['active', 'inactive', 'new'];
//тест работоспособности
console.log('\nреализация (объект):');
statuses.forEach(status => {
    const color = getStatusColor(status);
    console.log(`Статус: ${status} -> Цвет: ${color}\n`);
});
//5 задача
type StringFormatter = (str: string, uppercase?: boolean) => string;

const capitalizeFirstLetter: StringFormatter 
= (str: string, uppercase: boolean = false): string => {
    if (str.length === 0) return str;
    
    
    const result = str.charAt(0).toUpperCase() 
    + str.slice(1).toLowerCase();
    
   
    return uppercase ? result.toUpperCase() : result;
};

const trimAndTransform: StringFormatter = 
(str: string, uppercase: boolean = false): string => {
    
    const trimmed = str.trim();
    
   
    return uppercase ? trimmed.toUpperCase() : trimmed;
};

const capitalizeFirstLetterAlt: StringFormatter = 
(str, uppercase = false) => 
    str.length === 0 ? str : 
    uppercase ? 
        str.toUpperCase() : 
        str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
//тест работоспособности
console.log('=== Функция capitalizeFirstLetter ===');
console.log(capitalizeFirstLetter('привет мир')); // "Привет мир"
console.log('\nС uppercase = true:');
console.log(capitalizeFirstLetter('привет мир', true)); // "ПРИВЕТ МИР"
console.log(capitalizeFirstLetter('')); // "" (пустая строка)
console.log('\n=== Функция trimAndTransform ===');
console.log('Обычный вызов (без uppercase):');
console.log(trimAndTransform('  привет мир  ')); // "привет мир"
console.log('\nС uppercase = true:');
console.log(trimAndTransform('  привет мир  ', true)); // "ПРИВЕТ МИР"
console.log(trimAndTransform(''),'\n'); // ""
//6 задача 
function  getFirstElement<T>(arr: T[]): T | undefined{
    if(arr == null){
        return undefined;
    } 
    else{
        return arr[0];
    }
}
//тест работоспособности
console.log('массив чисел');
console.log(getFirstElement([1,2,5,6]));
console.log('массив строк');
console.log(getFirstElement(['a','b','f','e']));
console.log('пустой массив');
console.log(getFirstElement([]));
//7 задача
interface HasId {
    id: number;
}
function findById<T extends HasId>(items: T[], id: number): T | undefined {
    for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) {
            return items[i];
        }
    }
    return undefined;
}
interface User7 extends HasId {
    name: string;
    email?: string;
    age: number;
}
//тест
const users: User7[] = [
    { id: 1, name: 'Иван Петров', age: 25 },
    { id: 2, name: 'Мария Сидорова', age: 30, email: 'maria@example.com' },
    { id: 3, name: 'Анна Иванова', age: 22 },
    { id: 4, name: 'Петр Смирнов', age: 35 },
    { id: 5, name: 'Елена Козлова', age: 28 }
];
console.log('=== Поиск пользователей по id ===');
const foundUser1 = findById(users, 2);
console.log('Найден пользователь с id 2:', foundUser1);

const foundUser2 = findById(users, 10);
console.log('Поиск пользователя с id 10:', foundUser2); // undefined
