// ============================================================================
// State Node — Individual state slice with local operations
// ============================================================================

import type { StateSlice } from "./types";

export interface StateNodeConfig<T> {
  id: string;
  initialValue: T;
  zone: string;
  category: StateSlice["category"];
  /** Optional validation before updates */
  validate?: (value: T) => boolean;
  /** Optional transform/middleware on updates */
  transform?: (prev: T, next: T) => T;
}

export interface StateNode<T> {
  readonly id: string;
  get(): T;
  set(value: T): void;
  update(fn: (current: T) => T): void;
  subscribe(listener: (value: T) => void): () => void;
  reset(): void;
}

export function createStateNode<T>(config: StateNodeConfig<T>): StateNode<T> {
  let value = config.initialValue;
  const listeners = new Set<(value: T) => void>();

  function notify(): void {
    listeners.forEach((fn) => fn(value));
  }

  return {
    id: config.id,

    get(): T {
      return value;
    },

    set(newValue: T): void {
      if (config.validate && !config.validate(newValue)) return;
      const transformed = config.transform
        ? config.transform(value, newValue)
        : newValue;
      value = transformed;
      notify();
    },

    update(fn: (current: T) => T): void {
      const newValue = fn(value);
      if (config.validate && !config.validate(newValue)) return;
      value = config.transform ? config.transform(value, newValue) : newValue;
      notify();
    },

    subscribe(listener: (value: T) => void): () => void {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    reset(): void {
      value = config.initialValue;
      notify();
    },
  };
}
