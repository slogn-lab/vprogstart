export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object 
    ? T[P] extends Function 
      ? T[P] 
      : DeepReadonly<T[P]>
    : T[P];
};
export type PickedByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};
export type EventHandlers<T> = {
  [K in keyof T as `on${K extends string ? Capitalize<K> : never}`]: (event: T[K]) => void;
};
