import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopNavigationComponent } from './top-navigation.component';
import { DataService, AuthenticationService } from '@services';
import { MockDataService } from '@services/mock-data.service';
import { IpcService } from '@services/ipc.service';
import { Router } from '@angular/router';
import { NavigationService } from '@core/services/navigation.service';
import { Actions } from '@ngxs/store';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMenuModule } from '@angular/material/menu';
import { ReactiveFormsModule } from '@angular/forms';
import { of, EMPTY } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppDownloadDialogComponent } from '@shared/components/app-download-dialog/app-download-dialog.component';

describe('TopNavigationComponent', () => {
  let component: TopNavigationComponent;
  let fixture: ComponentFixture<TopNavigationComponent>;
  let dialog: jasmine.SpyObj<MatDialog>;

  const mockDataService = { updateSearchQuery: () => {} };
  const mockIpcService = { minimizeWindow: () => {}, minimizeRestoreWindow: () => {}, exitApp: () => {} };
  const mockRouter = { navigate: () => {}, url: '/dashboard' };
  const mockAuthService = { logout: () => of(true) };
  const mockActions = EMPTY;
  const mockNavigationService = { back: () => {} };
  const mockMockDataService = { getMovieGenres: () => of([]) };

  beforeEach(async () => {
    dialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatAutocompleteModule,
        MatMenuModule,
        ReactiveFormsModule
      ],
      declarations: [TopNavigationComponent],
      providers: [
        { provide: DataService, useValue: mockDataService },
        { provide: IpcService, useValue: mockIpcService },
        { provide: Router, useValue: mockRouter },
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: Actions, useValue: mockActions },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: MockDataService, useValue: mockMockDataService },
        { provide: MatDialog, useValue: dialog }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TopNavigationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog on mobile', () => {
    // Force window.innerWidth for testing
    Object.defineProperty(window, 'innerWidth', {
        value: 500,
        configurable: true
    });
    
    component.onDownloadApp();
    expect(dialog.open).toHaveBeenCalledWith(AppDownloadDialogComponent);
  });

  it('should trigger download on macOS browser', () => {
    Object.defineProperty(window, 'innerWidth', {
        value: 1200,
        configurable: true
    });
    component.isMacBrowser = true;
    spyOn(window, 'open');
    component.onDownloadApp();
    expect(window.open).toHaveBeenCalledWith(component.downloadUrl, '_blank');
  });

  it('should not trigger download on Windows browser', () => {
    Object.defineProperty(window, 'innerWidth', {
        value: 1200,
        configurable: true
    });
    component.isMacBrowser = false;
    component.isWindowsBrowser = true;
    spyOn(window, 'open');
    component.onDownloadApp();
    expect(window.open).not.toHaveBeenCalled();
  });
});
