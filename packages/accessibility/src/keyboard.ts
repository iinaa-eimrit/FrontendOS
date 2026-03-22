// ============================================================================
// Keyboard Navigation Engine — Global shortcut management
// ============================================================================

import type { KeyBinding } from "./types";

export class KeyboardEngine {
  private bindings = new Map<string, KeyBinding>();
  private scopes = new Map<string, Set<string>>();
  private activeScope: string | null = null;
  private listener: ((e: KeyboardEvent) => void) | null = null;

  constructor() {
    this.attach();
  }

  /** Register a keyboard shortcut */
  register(binding: KeyBinding): void {
    const key = this.serializeBinding(binding);
    this.bindings.set(key, binding);

    if (binding.scope) {
      if (!this.scopes.has(binding.scope)) {
        this.scopes.set(binding.scope, new Set());
      }
      this.scopes.get(binding.scope)!.add(key);
    }
  }

  /** Unregister a keyboard shortcut */
  unregister(binding: Pick<KeyBinding, "key" | "ctrl" | "alt" | "shift" | "meta">): void {
    const key = this.serializeBinding(binding as KeyBinding);
    const existing = this.bindings.get(key);
    if (existing?.scope) {
      this.scopes.get(existing.scope)?.delete(key);
    }
    this.bindings.delete(key);
  }

  /** Set the active scope — only matching bindings fire */
  setScope(scope: string | null): void {
    this.activeScope = scope;
  }

  /** Get all registered bindings, optionally by scope */
  getBindings(scope?: string): KeyBinding[] {
    if (!scope) return [...this.bindings.values()];
    const keys = this.scopes.get(scope);
    if (!keys) return [];
    return [...keys].map((k) => this.bindings.get(k)!).filter(Boolean);
  }

  /** Destroy the engine and remove listeners */
  destroy(): void {
    if (this.listener) {
      document.removeEventListener("keydown", this.listener);
      this.listener = null;
    }
    this.bindings.clear();
    this.scopes.clear();
  }

  private attach(): void {
    this.listener = (e: KeyboardEvent) => {
      const key = this.serializeEvent(e);
      const binding = this.bindings.get(key);
      if (!binding) return;

      if (binding.scope && this.activeScope && binding.scope !== this.activeScope) {
        return;
      }

      e.preventDefault();
      binding.handler(e);
    };

    document.addEventListener("keydown", this.listener);
  }

  private serializeBinding(
    binding: Pick<KeyBinding, "key" | "ctrl" | "alt" | "shift" | "meta">,
  ): string {
    const parts: string[] = [];
    if (binding.ctrl) parts.push("Ctrl");
    if (binding.alt) parts.push("Alt");
    if (binding.shift) parts.push("Shift");
    if (binding.meta) parts.push("Meta");
    parts.push(binding.key.toLowerCase());
    return parts.join("+");
  }

  private serializeEvent(e: KeyboardEvent): string {
    const parts: string[] = [];
    if (e.ctrlKey) parts.push("Ctrl");
    if (e.altKey) parts.push("Alt");
    if (e.shiftKey) parts.push("Shift");
    if (e.metaKey) parts.push("Meta");
    parts.push(e.key.toLowerCase());
    return parts.join("+");
  }
}
