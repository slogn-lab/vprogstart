//1 задача
export interface User{
    id:number;
    name:string;
    email?:string;
    isActive?:boolean;
}
export default function createUsers(params:User): User {
    return{
        id: params.id,
        name: params.name,
        email: params.email,
        isActive: params.isActive ?? true
    };
}
//2 задача
export interface Book{
    title:string;
    author:string;
    year?:number;
    genre:'fiction' | 'non-fiction';
}
export function createBook(book: Book): Book{
    return book;
}

//3 задача
export function calculateArea(shape: 'circle', radius: number): number;
export function calculateArea(shape: 'square', side: number): number;

export function calculateArea(shape:'circle'|'square',param:number): number{
    switch(shape){
        case 'circle':
            return Math.PI * Math.pow(param, 2);
        case 'square':
            return Math.pow(param, 2);
        default:
            throw new Error('Неподдерживаемая фигура');
    }
}
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

//6 задача 
function  getFirstElement<T>(arr: T[]): T | undefined{
    if(arr == null){
        return undefined;
    } 
    else{
        return arr[0];
    }
}
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
