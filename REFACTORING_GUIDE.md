# Codebase Assessment & Refactoring Guide: Modular Architecture

## 1. Findings Summary
*   **"God Service" Pattern:** `DataService` (`src/app/services/data.service.ts`) acts as a global state container for unrelated features (Search, Dashboard, Movie Selection, Discovery). This violates **Feature Isolation** and **Minimal Shared Surface Area**.
*   **Tight Coupling:** `DetailsComponent` (`src/app/modules/movie/details/details.component.ts`) is tightly coupled to `DataService` to trigger navigation and pass data to other pages (e.g., `goToDiscover`, `playPreview`).
*   **Leaking Domain Logic:** Business logic for "Discovery" parameters is mixed into the generic `DataService` (`updateDiscoverQuery`).
*   **No Feature Toggles:** Critical navigation paths and feature integrations are hard-coded without toggle guards.

## 2. Risks Identified
*   **Regression Chains:** Modifying `DataService` for the "Search" team could inadvertently break "Discovery" or "Dashboard" features due to shared mutable state.
*   **Merge Conflicts:** Multiple teams working on different features will collide in `DataService.ts`.
*   **Test Fragility:** Unit tests for `DetailsComponent` require mocking the entire `DataService`, making them brittle and hard to maintain.

## 3. Refactoring Target: Movie Discovery Navigation
**Goal:** Decouple `DetailsComponent` from `DataService` for the "Discover" feature. Move discovery state management into the `MovieModule` or a dedicated `DiscoverModule`.

## 4. Before / After File & Folder Structure

### Before
```text
src/
├── app/
│   ├── modules/
│   │   └── movie/
│   │       └── details/
│   │           └── details.component.ts  <-- Directly calls DataService
│   └── services/
│       └── data.service.ts               <-- Holds state for EVERYONE
```

### After
```text
src/
├── app/
│   ├── modules/
│   │   └── movie/
│   │       ├── details/
│   │       │   └── details.component.ts   <-- Uses DiscoveryCoordinator
│   │       ├── discover/
│   │       │   ├── services/
│   │       │   │   └── discovery-state.service.ts <-- Isolated State
│   │       │   └── discovery.coordinator.ts       <-- Public Facade
│   │       └── movie.module.ts
│   └── shared/
│       └── services/
│           └── feature-toggle.service.ts
```

## 5. Before / After Key Code Examples

### Before: `DetailsComponent` (Coupled)
```typescript
// src/app/modules/movie/details/details.component.ts
import { DataService } from '@services/data.service';

export class DetailsComponent {
  constructor(private dataService: DataService, private router: Router) {}

  goToDiscover(type: string, id: string, name?: string) {
    // VIOLATION: Directly mutating global state for another feature
    this.dataService.updateDiscoverQuery({ type: type, value: id, name: name });
    this.router.navigate([`/discover`], { queryParams: { type, id, name } });
  }
}
```

### After: `DetailsComponent` (Decoupled & Toggled)

```typescript
// src/app/modules/movie/details/details.component.ts
import { DiscoveryCoordinator } from '../discover/discovery.coordinator';
import { FeatureToggleService } from '@shared/services/feature-toggle.service';

export class DetailsComponent {
  constructor(
    private discoveryCoordinator: DiscoveryCoordinator, // Composition
    private featureToggle: FeatureToggleService
  ) {}

  goToDiscover(type: string, id: string, name?: string) {
    // STRATEGY: Check toggle before executing new logic
    if (this.featureToggle.isEnabled('NEW_DISCOVERY_FLOW')) {
      this.discoveryCoordinator.navigateToDiscovery(type, id, name);
    } else {
      // Fallback/Legacy logic if needed, or no-op
      console.warn('New discovery flow is disabled.');
    }
  }
}
```

### New: `DiscoveryCoordinator` (Stable Interface)
```typescript
// src/app/modules/movie/discover/discovery.coordinator.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DiscoveryStateService } from './services/discovery-state.service';

/**
 * Acts as the Public API/Facade for the Discover Feature.
 * Other modules use this to interact with Discovery without knowing about internal state.
 */
@Injectable({ providedIn: 'root' })
export class DiscoveryCoordinator {
  constructor(
    private state: DiscoveryStateService,
    private router: Router
  ) {}

  navigateToDiscovery(type: string, id: string, name?: string) {
    this.state.setQuery({ type, value: id, name });
    this.router.navigate(['/discover']);
  }
}
```

## 6. Refactoring Rationale
1.  **Feature Isolation:** `DataService` is no longer polluted with discovery logic. The state lives inside `DiscoverModule`.
2.  **Stable Contracts:** `DiscoveryCoordinator` provides a clear method `navigateToDiscovery`. If the internal routing or state management of "Discover" changes, `DetailsComponent` doesn't need to change.
3.  **Toggle Safety:** The `FeatureToggleService` ensures that the new decoupled flow can be turned off if bugs are found, without reverting code.
4.  **Composition:** We inject a coordinator rather than inheriting behavior or accessing global singletons.

## 7. Recommendations for Other Similar Modules
*   **Search Feature:** Create a `SearchCoordinator` and `SearchStateService`. Remove `searchQuery` and `currentSearchResults` from `DataService`.
*   **Dashboard:** Create a `DashboardService` to handle `dashboardData`.
*   **Preview:** Move `previewMovie` state to a `PlayerCoordinator` or `MediaService`.

## 8. Golden Path for Future Features

**Mock Feature: "Watchlist"**

1.  **Structure:**
    ```text
    src/app/modules/watchlist/
    ├── watchlist.module.ts
    ├── components/
    ├── services/
    │   └── watchlist-state.service.ts
    └── watchlist.coordinator.ts  <-- Public API
    ```

2.  **Implementation (Coordinator):**
    ```typescript
    @Injectable({ providedIn: 'root' })
    export class WatchlistCoordinator {
      constructor(private state: WatchlistStateService) {}

      addToWatchlist(movieId: string): void {
         this.state.add(movieId);
      }
    }
    ```

3.  **Usage (with Strategy Pattern for Toggles):**
    ```typescript
    // In MovieDetailsComponent
    addToWatchlist(id: string) {
       this.toggleService.execute({
          feature: 'WATCHLIST_V2',
          onEnabled: () => this.watchlistCoordinator.addToWatchlist(id),
          onDisabled: () => this.legacyService.add(id)
       });
    }
    ```

4.  **Testing (Feature Toggle State):**
    ```typescript
    it('should use Coordinator when toggle is ON', () => {
       mockToggleService.isEnabled.and.returnValue(true);
       component.addToWatchlist('123');
       expect(watchlistCoordinator.addToWatchlist).toHaveBeenCalledWith('123');
    });

    it('should use Legacy Service when toggle is OFF', () => {
       mockToggleService.isEnabled.and.returnValue(false);
       component.addToWatchlist('123');
       expect(legacyService.add).toHaveBeenCalledWith('123');
    });
```