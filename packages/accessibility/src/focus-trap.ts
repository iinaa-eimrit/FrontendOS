// ============================================================================
// Focus Trap — Trap focus within a container (modals, dialogs)
// ============================================================================

import type { FocusTrapConfig } from "./types";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type=hidden])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
  "[contenteditable]",
].join(", ");

export class FocusTrap {
  private config: FocusTrapConfig;
  private previouslyFocused: HTMLElement | null = null;
  private active = false;
  private onKeyDown: ((e: KeyboardEvent) => void) | null = null;

  constructor(config: FocusTrapConfig) {
    this.config = config;
  }

  /** Activate the focus trap */
  activate(): void {
    if (this.active) return;
    this.active = true;
    this.previouslyFocused = document.activeElement as HTMLElement;

    // Set initial focus
    const initial = this.getInitialFocusElement();
    if (initial) {
      (initial as HTMLElement).focus();
    } else {
      const first = this.getFocusableElements()[0];
      first?.focus();
    }

    this.onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && this.config.escapeDeactivates !== false) {
        this.deactivate();
        return;
      }

      if (e.key === "Tab") {
        this.handleTab(e);
      }
    };

    document.addEventListener("keydown", this.onKeyDown);

    if (this.config.clickOutsideDeactivates) {
      document.addEventListener("mousedown", this.handleOutsideClick);
    }
  }

  /** Deactivate the focus trap */
  deactivate(): void {
    if (!this.active) return;
    this.active = false;

    if (this.onKeyDown) {
      document.removeEventListener("keydown", this.onKeyDown);
      this.onKeyDown = null;
    }

    document.removeEventListener("mousedown", this.handleOutsideClick);

    if (this.config.returnFocusOnDeactivate !== false && this.previouslyFocused) {
      this.previouslyFocused.focus();
    }
  }

  /** Check if trap is currently active */
  isActive(): boolean {
    return this.active;
  }

  private handleTab(e: KeyboardEvent): void {
    const focusable = this.getFocusableElements();
    if (focusable.length === 0) return;

    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  private handleOutsideClick = (e: MouseEvent): void => {
    if (!this.config.container.contains(e.target as Node)) {
      if (!this.config.allowOutsideClick) {
        e.preventDefault();
        e.stopPropagation();
      }
      this.deactivate();
    }
  };

  private getFocusableElements(): HTMLElement[] {
    return Array.from(
      this.config.container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((el) => el.offsetParent !== null); // visible only
  }

  private getInitialFocusElement(): Element | null {
    if (!this.config.initialFocus) return null;
    if (typeof this.config.initialFocus === "string") {
      return this.config.container.querySelector(this.config.initialFocus);
    }
    return this.config.initialFocus;
  }
}
