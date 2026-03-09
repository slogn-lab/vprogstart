export type Transform<T> = (array: T[]) => T[];
export type Where<T> = <K extends keyof T>(
  key: K,
  value: T[K]
) => Transform<T>;
export type Sort<T> = <K extends keyof T>(
  key: K
) => Transform<T>;
export type Group<T, K extends keyof T> = { key: T[K]; items: T[]; }
export type GroupBy<T> = <K extends keyof T>(key: K) => Transform<Group<T, K>>
export type GroupTransform<T, K extends keyof T> = (
  groups: Group<T, K>[]
) => Group<T, K>[];
export type Having<T> = <K extends keyof T>(
  predicate: (group: Group<T, K>) => boolean
) => GroupTransform<T, K>;
// Вспомогательные типы для определения, является ли шаг групповым
export type IsGroupTransform<T> = T extends GroupTransform<any, any> ? true : false;

// Тип для объединения всех возможных шагов
export type QueryStep<T> = 
  | Transform<T> 
  | GroupTransform<T, any>;

export function query<T>(
  ...steps: QueryStep<T>[]
): Transform<T> {
  return (initialData: T[]) => {
    let result: any = initialData;
    
    for (const step of steps) {
      result = step(result);
    }
    
    return result as T[];
  };
}