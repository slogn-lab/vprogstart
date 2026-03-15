// Базовые типы
export type Transform<T> = (array: T[]) => T[];
export type GroupTransform<T, K extends keyof T> = (groups: Group<T, K>[]) => Group<T, K>[];

// Типы для операций
export type Where<T> = <K extends keyof T>(key: K, value: T[K]) => Transform<T>;
export type Sort<T> = <K extends keyof T>(key: K) => Transform<T>;
export type Group<T, K extends keyof T> = { key: T[K]; items: T[]; }
export type GroupBy<T> = <K extends keyof T>(key: K) => Transform<Group<T, K>>
export type Having<T> = <K extends keyof T>(predicate: (group: Group<T, K>) => boolean) => GroupTransform<T, K>;

// Маркеры для разных этапов
export interface WhereStage<T> {
  type: 'where';
  steps: Transform<T>[];
}

export interface GroupByStage<T> {
  type: 'groupBy';
  steps: ((data: T[]) => Group<T, any>[])[];
  groupKey?: any;
}

export interface HavingStage<T> {
  type: 'having';
  steps: GroupTransform<T, any>[];
  groupKey: any;
}

export interface SortStage<T> {
  type: 'sort';
  steps: Transform<T>[];
}

// Объединение всех возможных стадий
export type QueryStage<T> = 
  | WhereStage<T>
  | GroupByStage<T>
  | HavingStage<T>
  | SortStage<T>;

// Типы-заглушки для валидации порядка
export type ValidateOrder<T, Stages extends any[]> = 
  Stages extends [] ? true :
  Stages extends [infer First, ...infer Rest] ? (
    First extends WhereStage<T> ? ValidateWhereOrder<T, Rest> :
    First extends GroupByStage<T> ? ValidateGroupByOrder<T, Rest> :
    First extends HavingStage<T> ? ValidateHavingOrder<T, Rest> :
    First extends SortStage<T> ? ValidateSortOrder<T, Rest> :
    false
  ) : false;

export type ValidateWhereOrder<T, Stages extends any[]> = 
  Stages extends [] ? true :
  Stages extends [infer First, ...infer Rest] ? (
    First extends WhereStage<T> ? ValidateWhereOrder<T, Rest> :
    First extends GroupByStage<T> ? ValidateGroupByOrder<T, Rest> :
    false
  ) : false;

export type ValidateGroupByOrder<T, Stages extends any[]> = 
  Stages extends [] ? true :
  Stages extends [infer First, ...infer Rest] ? (
    First extends GroupByStage<T> ? ValidateGroupByOrder<T, Rest> :
    First extends HavingStage<T> ? ValidateHavingOrder<T, Rest> :
    First extends SortStage<T> ? ValidateSortOrder<T, Rest> :
    false
  ) : false;

export type ValidateHavingOrder<T, Stages extends any[]> = 
  Stages extends [] ? true :
  Stages extends [infer First, ...infer Rest] ? (
    First extends HavingStage<T> ? ValidateHavingOrder<T, Rest> :
    First extends SortStage<T> ? ValidateSortOrder<T, Rest> :
    false
  ) : false;

export type ValidateSortOrder<T, Stages extends any[]> = 
  Stages extends [] ? true :
  Stages extends [infer First, ...infer Rest] ? (
    First extends SortStage<T> ? ValidateSortOrder<T, Rest> :
    false
  ) : false;

// Функции для создания стадий - ИСПРАВЛЕНО: убраны лишние параметры типа
export function where<T>(key: keyof T, value: any): WhereStage<T> {
  const step: Transform<T> = (array) => array.filter(item => item[key] === value);
  return { type: 'where', steps: [step] };
}

export function groupBy<T>(key: keyof T): GroupByStage<T> {
  const step = (array: T[]): Group<T, any>[] => {
    const groups = new Map<any, T[]>();
    array.forEach(item => {
      const groupKey = item[key];
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(item);
    });
    return Array.from(groups.entries()).map(([key, items]) => ({ key, items }));
  };
  return { type: 'groupBy', steps: [step], groupKey: key };
}

export function having<T>(predicate: (group: Group<T, any>) => boolean): HavingStage<T> {
  const step: GroupTransform<T, any> = (groups) => groups.filter(predicate);
  return { type: 'having', steps: [step], groupKey: null as any };
}

export function sort<T>(
  key: keyof T, 
  direction: 'asc' | 'desc' = 'asc'
): SortStage<T> {
  const step: Transform<T> = (array) => {
    return [...array].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  };
  return { type: 'sort', steps: [step] };
}

// Функция query с проверкой порядка - ИСПРАВЛЕНО: упрощена типизация
export function query<T>(
  ...stages: QueryStage<T>[]
): Transform<T> {
  return (initialData: T[]) => {
    let result: any = initialData;
    
    for (const stage of stages) {
      for (const step of stage.steps) {
        result = step(result);
      }
    }
    
    return result as T[];
  };
}
// Функция для проверки порядка (опционально)
export function validateQueryOrder<T>(...stages: QueryStage<T>[]): boolean {
  let stage: 'where' | 'groupBy' | 'having' | 'sort' = 'where';
  
  for (const s of stages) {
    switch (stage) {
      case 'where':
        if (s.type === 'where') continue;
        if (s.type === 'groupBy') {
          stage = 'groupBy';
          continue;
        }
        return false;
      case 'groupBy':
        if (s.type === 'groupBy') continue;
        if (s.type === 'having') {
          stage = 'having';
          continue;
        }
        if (s.type === 'sort') {
          stage = 'sort';
          continue;
        }
        return false;
      case 'having':
        if (s.type === 'having') continue;
        if (s.type === 'sort') {
          stage = 'sort';
          continue;
        }
        return false;
      case 'sort':
        if (s.type === 'sort') continue;
        return false;
    }
  }
  
  return true;
}