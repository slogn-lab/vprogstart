// src/formatCSVFileToJSONFile.ts
import { readFile, writeFile } from 'node:fs/promises';
import { EOL } from 'node:os';

/**
 * Преобразует CSV строку в массив строк
 */
function parseCSVContent(content: string, delimiter: string): string[] {
    // Разделяем содержимое на строки, учитывая разные форматы окончания строк
    const lines = content
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.length > 0); // Удаляем пустые строки
    
    if (lines.length === 0) {
        throw new Error('CSV file is empty');
    }
    
    return lines;
}

/**
 * Форматирует JSON данные для записи в файл с отступами
 */
function formatJSONForFile(data: object[]): string {
    return JSON.stringify(data, null, 2) + EOL;
}

/**
 * Функция для преобразования CSV файла в JSON файл
 * @param input - путь к входному CSV файлу
 * @param output - путь к выходному JSON файлу
 * @param delimiter - разделитель полей в CSV
 * @returns Promise<void>
 */
export async function formatCSVFileToJSONFile(
    input: string, 
    output: string, 
    delimiter: string
): Promise<void> {
    try {
        // 1. Читаем CSV файл
        console.log(`Reading CSV file from: ${input}`);
        const csvContent = await readFile(input, { encoding: 'utf-8' });
        
        // 2. Парсим содержимое в массив строк
        const lines = parseCSVContent(csvContent, delimiter);
        
        // 3. Преобразуем CSV в JSON используя ранее созданную функцию
        console.log('Converting CSV to JSON...');
        const jsonData = csvToJSON(lines, delimiter);
        
        // 4. Форматируем JSON для записи
        const jsonContent = formatJSONForFile(jsonData);
        
        // 5. Записываем JSON файл
        console.log(`Writing JSON file to: ${output}`);
        await writeFile(output, jsonContent, { encoding: 'utf-8' });
        
        console.log('File conversion completed successfully!');
        console.log(`Converted ${lines.length - 1} records from CSV to JSON`);
        
    } catch (error) {
        // Обрабатываем и пробрасываем ошибки дальше
        if (error instanceof Error) {
            throw new Error(`Failed to convert CSV to JSON: ${error.message}`);
        }
        throw error;
    }
}

export function csvToJSON(input: string[], delimiter: string): object[] {
    // Проверка на пустой входной массив
    if (!input || input.length === 0) {
        throw new Error("Input array is empty");
    }

    // Получаем заголовки из первой строки
    const headers = input[0].split(delimiter);
    
    // Проверяем, что заголовки не пустые
    if (headers.length === 0 || headers.some(h => h.trim() === '')) {
        throw new Error("Invalid headers: empty header detected");
    }

    const result: object[] = [];

    for (let i = 1; i < input.length; i++) {
        const row = input[i];
        
        // Разбиваем строку по разделителю
        const values = row.split(delimiter);
        
        // Проверяем соответствие количества значений количеству заголовков
        if (values.length !== headers.length) {
            throw new Error(
                `Row ${i + 1}: column count mismatch. ` +
                `Expected ${headers.length} columns, got ${values.length}`
            );
        }

        
        const obj: any = {};
        
        // Заполняем объект значениями
        for (let j = 0; j < headers.length; j++) {
            const header = headers[j].trim();
            const value = values[j].trim();
            
            // Пытаемся преобразовать значение в число, если это возможно
            obj[header] = tryParseNumber(value);
        }
        
        result.push(obj);
    }

    return result;
}

function tryParseNumber(value: string): string | number {
    // Проверяем, является ли строка числом
    if (value === '') {
        return value;
    }
    
    const num = Number(value);
    // Если это валидное число и не NaN, и не бесконечность
    if (!isNaN(num) && isFinite(num) && value.trim() !== '') {
        return num;
    }
    
    return value;
}