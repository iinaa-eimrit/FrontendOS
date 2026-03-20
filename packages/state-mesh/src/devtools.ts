// ============================================================================
// State Mesh DevTools — Runtime inspection and time-travel debugging
// ============================================================================

import type { StateMeshCore } from "./core";
import type { StateEvent, StateMeshSnapshot } from "./types";

export class StateMeshDevTools {
  private snapshots: StateMeshSnapshot[] = [];
  private isRecording = false;

  constructor(private readonly mesh: StateMeshCore) {}

  /** Start recording state changes */
  startRecording(): void {
    this.isRecording = true;
    this.snapshots = [this.mesh.snapshot()];

    this.mesh.subscribeAll((_event: StateEvent) => {
      if (this.isRecording) {
        this.snapshots.push(this.mesh.snapshot());
      }
    });
  }

  /** Stop recording */
  stopRecording(): StateMeshSnapshot[] {
    this.isRecording = false;
    return [...this.snapshots];
  }

  /** Get current mesh state as a serializable object */
  inspect(): {
    slices: ReturnType<StateMeshCore["listSlices"]>;
    snapshot: StateMeshSnapshot;
  } {
    return {
      slices: this.mesh.listSlices(),
      snapshot: this.mesh.snapshot(),
    };
  }

  /** Export full state history as JSON */
  exportHistory(): string {
    return JSON.stringify(this.snapshots, null, 2);
  }

  /** Get recorded snapshot count */
  get snapshotCount(): number {
    return this.snapshots.length;
  }
}
