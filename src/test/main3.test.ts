import { csvToJSON } from '../main/main3'; 
describe('csvToJSON', () => {
    describe('Корректные входные данные', () => {
        test('должен преобразовать простой CSV с числами и строками', () => {
            const input = [
                'name,age,city',
                'John,25,New York',
                'Jane,30,Boston',
                'Bob,35,Chicago'
            ];
            const delimiter = ',';
            
            const result = csvToJSON(input, delimiter);
            
            expect(result).toEqual([
                { name: 'John', age: 25, city: 'New York' },
                { name: 'Jane', age: 30, city: 'Boston' },
                { name: 'Bob', age: 35, city: 'Chicago' }
            ]);
        });

        test('должен обрабатывать пустые строки как строки, а не числа', () => {
            const input = [
                'name,age,city',
                'John,,New York',
                'Jane,30,'
            ];
            const delimiter = ',';
            
            const result = csvToJSON(input, delimiter);
            
            expect(result).toEqual([
                { name: 'John', age: '', city: 'New York' },
                { name: 'Jane', age: 30, city: '' }
            ]);
        });

        test('должен обрабатывать числа с плавающей точкой', () => {
            const input = [
                'product,price,quantity',
                'Apple,1.99,10',
                'Banana,0.99,15.5'
            ];
            const delimiter = ',';
            
            const result = csvToJSON(input, delimiter);
            
            expect(result).toEqual([
                { product: 'Apple', price: 1.99, quantity: 10 },
                { product: 'Banana', price: 0.99, quantity: 15.5 }
            ]);
        });

        test('должен работать с разными разделителями (точка с запятой)', () => {
            const input = [
                'name;age;city',
                'John;25;New York',
                'Jane;30;Boston'
            ];
            const delimiter = ';';
            
            const result = csvToJSON(input, delimiter);
            
            expect(result).toEqual([
                { name: 'John', age: 25, city: 'New York' },
                { name: 'Jane', age: 30, city: 'Boston' }
            ]);
        });

        test('должен работать с разными разделителями (табуляция)', () => {
            const input = [
                'name\tage\tcity',
                'John\t25\tNew York',
                'Jane\t30\tBoston'
            ];
            const delimiter = '\t';
            
            const result = csvToJSON(input, delimiter);
            
            expect(result).toEqual([
                { name: 'John', age: 25, city: 'New York' },
                { name: 'Jane', age: 30, city: 'Boston' }
            ]);
        });

        test('должен обрезать пробелы в заголовках и значениях', () => {
            const input = [
                '  name  ,  age  ,  city  ',
                '  John  ,  25  ,  New York  ',
                '  Jane  ,  30  ,  Boston  '
            ];
            const delimiter = ',';
            
            const result = csvToJSON(input, delimiter);
            
            expect(result).toEqual([
                { name: 'John', age: 25, city: 'New York' },
                { name: 'Jane', age: 30, city: 'Boston' }
            ]);
        });

        test('должен обрабатывать отрицательные числа', () => {
            const input = [
                'city,temperature,humidity',
                'Moscow,-10,80',
                'Saint Petersburg,-15,85'
            ];
            const delimiter = ',';
            
            const result = csvToJSON(input, delimiter);
            
            expect(result).toEqual([
                { city: 'Moscow', temperature: -10, humidity: 80 },
                { city: 'Saint Petersburg', temperature: -15, humidity: 85 }
            ]);
        });

        test('должен обрабатывать одну строку данных', () => {
            const input = [
                'name,age',
                'John,25'
            ];
            const delimiter = ',';
            
            const result = csvToJSON(input, delimiter);
            
            expect(result).toEqual([
                { name: 'John', age: 25 }
            ]);
        });
    });

    describe('Некорректные входные данные', () => {
        test('должен выбрасывать ошибку при пустом входном массиве', () => {
            expect(() => {
                csvToJSON([], ',');
            }).toThrow('Input array is empty');
            
            expect(() => {
                csvToJSON(null as any, ',');
            }).toThrow('Input array is empty');
            
            expect(() => {
                csvToJSON(undefined as any, ',');
            }).toThrow('Input array is empty');
        });

        test('должен выбрасывать ошибку при пустых заголовках', () => {
            const input = [
                ''
            ];
            
            expect(() => {
                csvToJSON(input, ',');
            }).toThrow('Invalid headers: empty header detected');
        });

        test('должен выбрасывать ошибку при пустом заголовке в строке заголовков', () => {
            const input = [
                'name,,city',
                'John,25,New York'
            ];
            
            expect(() => {
                csvToJSON(input, ',');
            }).toThrow('Invalid headers: empty header detected');
        });

        test('должен выбрасывать ошибку при заголовке только с пробелами', () => {
            const input = [
                'name,   ,city',
                'John,25,New York'
            ];
            
            expect(() => {
                csvToJSON(input, ',');
            }).toThrow('Invalid headers: empty header detected');
        });

        test('должен выбрасывать ошибку при несоответствии количества столбцов', () => {
            const input = [
                'name,age,city',
                'John,25,New York,extra',
                'Jane,30'
            ];
            
            expect(() => {
                csvToJSON(input, ',');
            }).toThrow('Row 2: column count mismatch. Expected 3 columns, got 4');
            
            expect(() => {
                csvToJSON(['name,age,city', 'John,25'], ',');
            }).toThrow('Row 2: column count mismatch. Expected 3 columns, got 2');
        });

        test('должен выбрасывать ошибку при пустом массиве с только заголовками', () => {
            const input = [
                'name,age,city'
            ];
            
            const result = csvToJSON(input, ',');
            expect(result).toEqual([]); // Это валидный случай - нет строк данных
        });

        test('должен обрабатывать специальные числовые значения как строки', () => {
            const input = [
                'value',
                'NaN',
                'Infinity',
                '-Infinity'
            ];
            const delimiter = ',';
            
            const result = csvToJSON(input, delimiter);
            
            expect(result).toEqual([
                { value: 'NaN' },
                { value: 'Infinity' },
                { value: '-Infinity' }
            ]);
        });

        test('должен обрабатывать строки, похожие на числа, но с пробелами', () => {
            const input = [
                'number',
                '  123  ',
                '  45.67  '
            ];
            const delimiter = ',';
            
            const result = csvToJSON(input, delimiter);
            
            expect(result).toEqual([
                { number: 123 },
                { number: 45.67 }
            ]);
        });

        test('должен выбрасывать ошибку при нестроковых элементах входного массива', () => {
            const input = [
                'name,age',
                'John,25',
                123 as any
            ];
            
            expect(() => {
                csvToJSON(input, ',');
            }).toThrow(); // Будет ошибка, так как row.split не является функцией
        });

        test('должен выбрасывать ошибку при некорректном разделителе', () => {
            const input = ['name,age', 'John,25'];
            
            expect(() => {
                csvToJSON(input, '' as any);
            }).toThrow(); // Пустой разделитель вызовет ошибку split
        });
    });

    describe('Краевые случаи', () => {
        test('должен обрабатывать числа в научной нотации', () => {
            const input = [
                'number',
                '1e3',
                '2.5e-2',
                '1E5'
            ];
            const delimiter = ',';
            
            const result = csvToJSON(input, delimiter);
            
            expect(result).toEqual([
                { number: 1000 },
                { number: 0.025 },
                { number: 100000 }
            ]);
        });

        test('должен обрабатывать очень большие числа', () => {
            const input = [
                'number',
                '9999999999999999',
                '12345678901234567890'
            ];
            const delimiter = ',';
            
            const result = csvToJSON(input, delimiter);
            
            expect(result).toEqual([
                { number: 9999999999999999 },
                { number: 12345678901234567890 }
            ]);
        });
    });
});
// тесты 2
import { formatCSVFileToJSONFile } from '../main/main3';
import { readFile, writeFile } from 'node:fs/promises';
import { EOL } from 'node:os';

// Мокаем только файловые операции
jest.mock('node:fs/promises');

describe('formatCSVFileToJSONFile', () => {
    // Очищаем моки перед каждым тестом
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Успешное преобразование', () => {
        test('должен успешно преобразовать CSV файл в JSON файл', async () => {
            
            const mockCSVContent = 'name,age,city\nJohn,25,New York\nJane,30,Boston';
            
            (readFile as jest.Mock).mockResolvedValue(mockCSVContent);
            (writeFile as jest.Mock).mockResolvedValue(undefined);
            
            
            await formatCSVFileToJSONFile('input.csv', 'output.json', ',');
            
            
            // Проверяем чтение файла
            expect(readFile).toHaveBeenCalledTimes(1);
            expect(readFile).toHaveBeenCalledWith('input.csv', { encoding: 'utf-8' });
            
            // Проверяем запись файла
            expect(writeFile).toHaveBeenCalledTimes(1);
            expect(writeFile).toHaveBeenCalledWith(
                'output.json',
                expect.stringContaining('"name"'),
                { encoding: 'utf-8' }
            );
            
            // Проверяем содержимое JSON
            const writeFileCall = (writeFile as jest.Mock).mock.calls[0];
            const jsonContent = writeFileCall[1];
            
            // Парсим результат и проверяем структуру
            const parsedJSON = JSON.parse(jsonContent);
            expect(parsedJSON).toEqual([
                { name: 'John', age: 25, city: 'New York' },
                { name: 'Jane', age: 30, city: 'Boston' }
            ]);
        });

        test('должен работать с разными разделителями', async () => {
            
            const mockCSVContent = 'name;age;city\nJohn;25;New York\nJane;30;Boston';
            
            (readFile as jest.Mock).mockResolvedValue(mockCSVContent);
            (writeFile as jest.Mock).mockResolvedValue(undefined);
            
        
            await formatCSVFileToJSONFile('input.csv', 'output.json', ';');
            
            expect(readFile).toHaveBeenCalledWith('input.csv', { encoding: 'utf-8' });
            
            const writeFileCall = (writeFile as jest.Mock).mock.calls[0];
            const jsonContent = writeFileCall[1];
            const parsedJSON = JSON.parse(jsonContent);
            
            expect(parsedJSON).toEqual([
                { name: 'John', age: 25, city: 'New York' },
                { name: 'Jane', age: 30, city: 'Boston' }
            ]);
        });

        test('должен добавлять EOL в конец файла', async () => {
            
            const mockCSVContent = 'name,age\nJohn,25';
            
            (readFile as jest.Mock).mockResolvedValue(mockCSVContent);
            (writeFile as jest.Mock).mockResolvedValue(undefined);
            
            await formatCSVFileToJSONFile('input.csv', 'output.json', ',');
            
            const writeFileCall = (writeFile as jest.Mock).mock.calls[0];
            const jsonContent = writeFileCall[1];
            expect(jsonContent.endsWith(EOL)).toBe(true);
        });
    });

    describe('Обработка ошибок', () => {
        test('должен пробрасывать ошибку при проблемах с чтением файла', async () => {
            
            const mockError = new Error('File not found');
            (readFile as jest.Mock).mockRejectedValue(mockError);
            
            await expect(
                formatCSVFileToJSONFile('nonexistent.csv', 'output.json', ',')
            ).rejects.toThrow('Failed to convert CSV to JSON: File not found');
            
            expect(writeFile).not.toHaveBeenCalled();
        });

        test('должен пробрасывать ошибку при пустом CSV файле', async () => {
            
            (readFile as jest.Mock).mockResolvedValue('');
            
            await expect(
                formatCSVFileToJSONFile('empty.csv', 'output.json', ',')
            ).rejects.toThrow('Failed to convert CSV to JSON: CSV file is empty');
            
            expect(writeFile).not.toHaveBeenCalled();
        });

        test('должен пробрасывать ошибку при некорректном CSV', async () => {
            
            const mockCSVContent = 'name,age\nJohn,25,extra';
            
            (readFile as jest.Mock).mockResolvedValue(mockCSVContent);
            
            await expect(
                formatCSVFileToJSONFile('input.csv', 'output.json', ',')
            ).rejects.toThrow('Failed to convert CSV to JSON');
            
            expect(writeFile).not.toHaveBeenCalled();
        });

        test('должен пробрасывать ошибку при проблемах с записью файла', async () => {
            
            const mockCSVContent = 'name,age\nJohn,25';
            const mockError = new Error('Permission denied');
            
            (readFile as jest.Mock).mockResolvedValue(mockCSVContent);
            (writeFile as jest.Mock).mockRejectedValue(mockError);
            
            await expect(
                formatCSVFileToJSONFile('input.csv', 'output.json', ',')
            ).rejects.toThrow(`Failed to convert CSV to JSON: ${mockError.message}`);
        });
    });

    describe('Проверка путей к файлам', () => {
        test('должен работать с разными типами путей', async () => {
            
            const mockCSVContent = 'name,age\nJohn,25';
            
            (readFile as jest.Mock).mockResolvedValue(mockCSVContent);
            (writeFile as jest.Mock).mockResolvedValue(undefined);
            
            await formatCSVFileToJSONFile('./data/input.csv', '/absolute/output.json', ',');
            
            expect(readFile).toHaveBeenCalledWith('./data/input.csv', { encoding: 'utf-8' });
            expect(writeFile).toHaveBeenCalledWith(
                '/absolute/output.json',
                expect.any(String),
                { encoding: 'utf-8' }
            );
        });
    });
});