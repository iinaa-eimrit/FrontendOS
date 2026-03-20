import { Component } from "@angular/core";
import { Store } from "@ngrx/store";

/**
 * Angular Legacy Zone — CSR with NgRx state management
 * Demonstrates migration path from Angular to other frameworks
 */
@Component({
  selector: "fos-legacy-dashboard",
  template: `
    <div class="p-8 bg-gray-950 text-gray-50 min-h-full" data-zone="legacy" data-framework="angular">
      <header class="mb-8">
        <h1 class="text-2xl font-bold text-gray-100">Legacy Dashboard</h1>
        <p class="text-sm text-gray-500 mt-1">Angular + NgRx · CSR · Migration Path</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div class="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 class="text-sm font-medium text-rose-400 mb-2">Framework</h3>
          <p class="text-xs text-gray-400">Angular 17 with standalone components</p>
          <div class="mt-3 flex gap-1.5 flex-wrap">
            <span class="px-2 py-0.5 text-xs bg-rose-500/10 text-rose-300 rounded">NgRx</span>
            <span class="px-2 py-0.5 text-xs bg-rose-500/10 text-rose-300 rounded">RxJS</span>
            <span class="px-2 py-0.5 text-xs bg-rose-500/10 text-rose-300 rounded">Signals</span>
          </div>
        </div>

        <div class="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 class="text-sm font-medium text-amber-400 mb-2">Migration Status</h3>
          <p class="text-xs text-gray-400">Gradually migrating to micro-frontends</p>
          <div class="mt-3">
            <div class="w-full bg-gray-800 rounded-full h-2">
              <div class="bg-amber-400 h-2 rounded-full" style="width: 35%"></div>
            </div>
            <p class="text-xs text-gray-500 mt-1">35% migrated</p>
          </div>
        </div>
      </div>

      <section>
        <h2 class="text-lg font-semibold mb-4 text-gray-200">Legacy Modules</h2>
        <div class="space-y-2">
          <div class="bg-gray-900 border border-gray-800 rounded-lg p-3 flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-200">User Management</p>
              <p class="text-xs text-gray-500">NgRx + Angular Forms</p>
            </div>
            <span class="px-2 py-0.5 text-xs bg-amber-500/10 text-amber-400 rounded">In Migration</span>
          </div>
          <div class="bg-gray-900 border border-gray-800 rounded-lg p-3 flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-200">Report Generator</p>
              <p class="text-xs text-gray-500">RxJS Streams + Angular CDK</p>
            </div>
            <span class="px-2 py-0.5 text-xs bg-rose-500/10 text-rose-400 rounded">Legacy</span>
          </div>
          <div class="bg-gray-900 border border-gray-800 rounded-lg p-3 flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-200">Settings Panel</p>
              <p class="text-xs text-gray-500">Angular Signals</p>
            </div>
            <span class="px-2 py-0.5 text-xs bg-green-500/10 text-green-400 rounded">Migrated</span>
          </div>
        </div>
      </section>
    </div>
  `,
  standalone: true,
})
export class LegacyDashboardComponent {}
