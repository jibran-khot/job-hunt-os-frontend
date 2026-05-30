import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject
} from '@angular/core';
import { AsyncPipe } from '@angular/common';

import {
  catchError,
  of
} from 'rxjs';

import { ApplicationsService } from '../../services/applications.service';
import { ApplicationsState } from '../../state/applications.state';

import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { SearchBoxComponent } from '../../../../shared/components/search-box/search-box.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';

import { ApplicationTableComponent } from '../../components/application-table/application-table.component';
import { LoaderComponent } from 'src/app/shared/components/loader/loader.component';

@Component({
  selector: 'app-applications-list',
  standalone: true,
  imports: [
    AsyncPipe,
    PageHeaderComponent,
    SearchBoxComponent,
    ApplicationTableComponent,
    PaginationComponent,
    LoaderComponent,
    EmptyStateComponent,
    ErrorStateComponent
  ],
  templateUrl: './applications-list.component.html',
  styleUrl: './applications-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationsListComponent implements OnInit {
  private readonly applicationsService =
    inject(ApplicationsService);

  private readonly applicationsState =
    inject(ApplicationsState);

  public readonly applications$ =
    this.applicationsState.applications$;

  public readonly loading$ =
    this.applicationsState.loading$;

  public readonly error$ =
    this.applicationsState.error$;

  public readonly totalRecords$ =
    this.applicationsState.totalRecords$;

  public currentPage = 1;

  public pageSize = 10;

  public searchTerm = '';

  public ngOnInit(): void {
    this.loadApplications();
  }

  public loadApplications(): void {
    this.applicationsService
      .getApplications()
      .pipe(
        catchError(() => of(null))
      )
      .subscribe();
  }

  public applyFilters(): void {
    if (this.searchTerm.trim()) {
      this.onSearch(this.searchTerm);

      return;
    }

    this.loadApplications();
  }

  public onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm.trim();
    this.currentPage = 1;

    if (!this.searchTerm) {
      this.loadApplications();

      return;
    }

    this.applicationsService
      .searchApplications(this.searchTerm)
      .pipe(
        catchError(() => of(null))
      )
      .subscribe();
  }

  public onPageChange(page: number): void {
    if (page < 1 || page === this.currentPage) {
      return;
    }

    this.currentPage = page;

    this.applyFilters();
  }
}