// ============================================================================
// Optimistic Update Manager
// ============================================================================

interface OptimisticUpdate<T> {
  id: string;
  optimisticValue: T;
  rollbackValue: T;
  timestamp: number;
  status: "pending" | "committed" | "rolled-back";
}

export class OptimisticManager<T> {
  private pending = new Map<string, OptimisticUpdate<T>>();

  /** Apply an optimistic update and return a rollback function */
  apply(id: string, optimisticValue: T, currentValue: T): () => void {
    const update: OptimisticUpdate<T> = {
      id,
      optimisticValue,
      rollbackValue: currentValue,
      timestamp: Date.now(),
      status: "pending",
    };

    this.pending.set(id, update);

    return () => {
      const entry = this.pending.get(id);
      if (entry) {
        entry.status = "rolled-back";
        this.pending.delete(id);
      }
    };
  }

  /** Commit an optimistic update (server confirmed) */
  commit(id: string): void {
    const entry = this.pending.get(id);
    if (entry) {
      entry.status = "committed";
      this.pending.delete(id);
    }
  }

  /** Get the rollback value for a pending update */
  getRollbackValue(id: string): T | undefined {
    return this.pending.get(id)?.rollbackValue;
  }

  /** Check if there are pending optimistic updates */
  hasPending(): boolean {
    return this.pending.size > 0;
  }

  /** Get all pending updates */
  getPending(): OptimisticUpdate<T>[] {
    return Array.from(this.pending.values());
  }
}
