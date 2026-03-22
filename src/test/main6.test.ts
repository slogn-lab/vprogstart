// types.test.ts
import { describe, it, expectTypeOf } from 'vitest';
import type { DeepReadonly, PickedByType, EventHandlers } from '../main/main6';

describe('DeepReadonly', () => {
  it('should make all properties readonly', () => {
    interface User {
      id: number;
      name: string;
      age: number;
    }

    type ReadonlyUser = DeepReadonly<User>;
    
    // Проверяем, что свойства стали readonly
    expectTypeOf<ReadonlyUser>().toMatchTypeOf<{
      readonly id: number;
      readonly name: string;
      readonly age: number;
    }>();
  });

  it('should recursively make nested objects readonly', () => {
    interface Nested {
      user: {
        id: number;
        profile: {
          name: string;
          email: string;
        };
      };
      settings: {
        theme: string;
      };
    }

    type ReadonlyNested = DeepReadonly<Nested>;
    
    expectTypeOf<ReadonlyNested>().toMatchTypeOf<{
      readonly user: {
        readonly id: number;
        readonly profile: {
          readonly name: string;
          readonly email: string;
        };
      };
      readonly settings: {
        readonly theme: string;
      };
    }>();
  });

  it('should not make functions readonly', () => {
    interface WithMethods {
      id: number;
      getName: () => string;
      setName: (name: string) => void;
    }

    type ReadonlyWithMethods = DeepReadonly<WithMethods>;
    
    // Функции остаются изменяемыми
    expectTypeOf<ReadonlyWithMethods['getName']>().toMatchTypeOf<() => string>();
    expectTypeOf<ReadonlyWithMethods['setName']>().toMatchTypeOf<(name: string) => void>();
    
    // Примитивы становятся readonly
    expectTypeOf<ReadonlyWithMethods['id']>().toEqualTypeOf<readonly [number]>()?.[0];
  });

  it('should handle arrays and tuples', () => {
    interface WithArrays {
      tags: string[];
      coordinates: [number, number];
      metadata: {
        values: number[];
      };
    }

    type ReadonlyWithArrays = DeepReadonly<WithArrays>;
    
    expectTypeOf<ReadonlyWithArrays['tags']>().toMatchTypeOf<readonly string[]>();
    expectTypeOf<ReadonlyWithArrays['coordinates']>().toMatchTypeOf<readonly [number, number]>();
    expectTypeOf<ReadonlyWithArrays['metadata']>().toMatchTypeOf<{
      readonly values: readonly number[];
    }>();
  });

  it('should handle union types', () => {
    interface WithUnion {
      value: string | number;
      nested: {
        data: string | null;
      };
    }

    type ReadonlyUnion = DeepReadonly<WithUnion>;
    
    expectTypeOf<ReadonlyUnion['value']>().toMatchTypeOf<string | number>();
    expectTypeOf<ReadonlyUnion['nested']>().toMatchTypeOf<{
      readonly data: string | null;
    }>();
  });
});

describe('PickedByType', () => {
  it('should pick properties of a specific type', () => {
    interface Test {
      id: number;
      name: string;
      age: number;
      email: string;
      isActive: boolean;
    }

    type StringProps = PickedByType<Test, string>;
    expectTypeOf<StringProps>().toEqualTypeOf<{
      name: string;
      email: string;
    }>();

    type NumberProps = PickedByType<Test, number>;
    expectTypeOf<NumberProps>().toEqualTypeOf<{
      id: number;
      age: number;
    }>();

    type BooleanProps = PickedByType<Test, boolean>;
    expectTypeOf<BooleanProps>().toEqualTypeOf<{
      isActive: boolean;
    }>();
  });

  it('should handle union types in the pick condition', () => {
    interface Test {
      id: number;
      name: string;
      age: number;
      isActive: boolean;
      data: Record<string, unknown>;
    }

    type StringOrNumber = PickedByType<Test, string | number>;
    expectTypeOf<StringOrNumber>().toEqualTypeOf<{
      id: number;
      name: string;
      age: number;
    }>();
  });

  it('should return empty object if no properties match', () => {
    interface Test {
      id: number;
      name: string;
    }

    type BooleanProps = PickedByType<Test, boolean>;
    expectTypeOf<BooleanProps>().toEqualTypeOf<Record<string, never>>();
  });

  it('should handle optional properties', () => {
    interface Test {
      id: number;
      name?: string;
      age?: number;
      email: string;
    }

    type StringProps = PickedByType<Test, string>;
    expectTypeOf<StringProps>().toEqualTypeOf<{
      name?: string;
      email: string;
    }>();
  });

  it('should handle complex types', () => {
    interface Complex {
      id: number;
      handler: () => void;
      data: { value: string };
      callback: (x: number) => string;
      tags: string[];
    }

    type FunctionProps = PickedByType<Complex, Function>;
    expectTypeOf<FunctionProps>().toEqualTypeOf<{
      handler: () => void;
      callback: (x: number) => string;
    }>();

    type ObjectProps = PickedByType<Complex, object>;
    expectTypeOf<ObjectProps>().toEqualTypeOf<{
      data: { value: string };
      tags: string[];
    }>();
  });
});

describe('EventHandlers', () => {
  it('should generate on-prefixed event handlers', () => {
    interface Events {
      click: { x: number; y: number };
      submit: { data: FormData };
      error: { message: string };
    }

    type Handlers = EventHandlers<Events>;
    
    expectTypeOf<Handlers>().toEqualTypeOf<{
      onClick: (event: { x: number; y: number }) => void;
      onSubmit: (event: { data: FormData }) => void;
      onError: (event: { message: string }) => void;
    }>();
  });

  it('should handle single word event names', () => {
    interface Events {
      load: { url: string };
      save: { id: number };
      reset: void;
    }

    type Handlers = EventHandlers<Events>;
    
    expectTypeOf<Handlers>().toMatchTypeOf<{
      onLoad: (event: { url: string }) => void;
      onSave: (event: { id: number }) => void;
      onReset: (event: void) => void;
    }>();
  });

  it('should handle multi-word event names with proper capitalization', () => {
    interface Events {
      'user-click': { userId: number };
      'form-submit': { isValid: boolean };
      'data-loaded': { records: unknown[] };
    }

    type Handlers = EventHandlers<Events>;
    
    expectTypeOf<Handlers>().toMatchTypeOf<{
      onUserClick: (event: { userId: number }) => void;
      onFormSubmit: (event: { isValid: boolean }) => void;
      onDataLoaded: (event: { records: unknown[] }) => void;
    }>();
  });

  it('should handle events with complex event objects', () => {
    interface ComplexEvents {
      httpResponse: {
        status: number;
        data: Record<string, unknown>;
        headers: Headers;
      };
      animation: {
        name: string;
        elapsedTime: number;
        target: Element;
      };
    }

    type Handlers = EventHandlers<ComplexEvents>;
    
    expectTypeOf<Handlers['onHttpResponse']>().toMatchTypeOf<
      (event: { status: number; data: Record<string, unknown>; headers: Headers }) => void
    >();
    
    expectTypeOf<Handlers['onAnimation']>().toMatchTypeOf<
      (event: { name: string; elapsedTime: number; target: Element }) => void
    >();
  });

  it('should handle empty events interface', () => {
    interface EmptyEvents {}

    type Handlers = EventHandlers<EmptyEvents>;
    expectTypeOf<Handlers>().toEqualTypeOf<{}>();
  });

  it('should handle events with void type', () => {
    interface Events {
      click: void;
      submit: void;
    }

    type Handlers = EventHandlers<Events>;
    
    expectTypeOf<Handlers['onClick']>().toMatchTypeOf<(event: void) => void>();
    expectTypeOf<Handlers['onSubmit']>().toMatchTypeOf<(event: void) => void>();
  });

  it('should preserve event type signatures correctly', () => {
    interface Events {
      customEvent: {
        detail: string;
        timestamp: number;
      };
    }

    type Handlers = EventHandlers<Events>;
    
    // Проверяем, что тип параметра event точно соответствует исходному типу
    type EventParameter = Parameters<Handlers['onCustomEvent']>[0];
    expectTypeOf<EventParameter>().toEqualTypeOf<{
      detail: string;
      timestamp: number;
    }>();
  });
});

// Дополнительные тесты для комбинированного использования
describe('Combined type tests', () => {
  it('should work with DeepReadonly and EventHandlers together', () => {
    interface AppState {
      events: {
        click: { x: number };
        submit: { data: string };
      };
      config: {
        theme: string;
        handlers: {
          onClick: () => void;
        };
      };
    }

    type ReadonlyState = DeepReadonly<AppState>;
    type ReadonlyHandlers = EventHandlers<ReadonlyState['events']>;
    
    expectTypeOf<ReadonlyHandlers['onClick']>().toMatchTypeOf<
      (event: { readonly x: number }) => void
    >();
  });

  it('should work with PickedByType and EventHandlers', () => {
    interface FullEvents {
      click: { x: number };
      submit: { data: string };
      error: { message: string };
      networkError: { code: number };
    }

    type ErrorEvents = PickedByType<FullEvents, { message: string } | { code: number }>;
    type ErrorHandlers = EventHandlers<ErrorEvents>;
    
    expectTypeOf<ErrorHandlers>().toMatchTypeOf<{
      onError: (event: { message: string }) => void;
      onNetworkError: (event: { code: number }) => void;
    }>();
  });
});