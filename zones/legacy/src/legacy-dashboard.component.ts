import { Component } from "@angular/core";
import { Store } from "@ngrx/store";

/**
 * Angular Legacy Zone — CSR with NgRx state management
 * Demonstrates migration path from Angular to other frameworks
 */
@Component({
  selector: "fos-legacy-dashboard",
  template: `
    <div
      class="min-h-full bg-gray-950 p-8 text-gray-50"
      data-zone="legacy"
      data-framework="angular"
    >
      <header class="mb-8">
        <h1 class="text-2xl font-bold text-gray-100">Legacy Dashboard</h1>
        <p class="mt-1 text-sm text-gray-500">Angular + NgRx · CSR · Migration Path</p>
      </header>

      <div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h3 class="mb-2 text-sm font-medium text-rose-400">Framework</h3>
          <p class="text-xs text-gray-400">Angular 17 with standalone components</p>
          <div class="mt-3 flex flex-wrap gap-1.5">
            <span class="rounded bg-rose-500/10 px-2 py-0.5 text-xs text-rose-300">NgRx</span>
            <span class="rounded bg-rose-500/10 px-2 py-0.5 text-xs text-rose-300">RxJS</span>
            <span class="rounded bg-rose-500/10 px-2 py-0.5 text-xs text-rose-300">Signals</span>
          </div>
        </div>

        <div class="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h3 class="mb-2 text-sm font-medium text-amber-400">Migration Status</h3>
          <p class="text-xs text-gray-400">Gradually migrating to micro-frontends</p>
          <div class="mt-3">
            <div class="h-2 w-full rounded-full bg-gray-800">
              <div class="h-2 rounded-full bg-amber-400" style="width: 35%"></div>
            </div>
            <p class="mt-1 text-xs text-gray-500">35% migrated</p>
          </div>
        </div>
      </div>

      <section>
        <h2 class="mb-4 text-lg font-semibold text-gray-200">Legacy Modules</h2>
        <div class="space-y-2">
          <div
            class="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 p-3"
          >
            <div>
              <p class="text-sm text-gray-200">User Management</p>
              <p class="text-xs text-gray-500">NgRx + Angular Forms</p>
            </div>
            <span class="rounded bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400"
              >In Migration</span
            >
          </div>
          <div
            class="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 p-3"
          >
            <div>
              <p class="text-sm text-gray-200">Report Generator</p>
              <p class="text-xs text-gray-500">RxJS Streams + Angular CDK</p>
            </div>
            <span class="rounded bg-rose-500/10 px-2 py-0.5 text-xs text-rose-400">Legacy</span>
          </div>
          <div
            class="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 p-3"
          >
            <div>
              <p class="text-sm text-gray-200">Settings Panel</p>
              <p class="text-xs text-gray-500">Angular Signals</p>
            </div>
            <span class="rounded bg-green-500/10 px-2 py-0.5 text-xs text-green-400">Migrated</span>
          </div>
        </div>
      </section>
    </div>
  `,
  standalone: true,
})
export class LegacyDashboardComponent {}
