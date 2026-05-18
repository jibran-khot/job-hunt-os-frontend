import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorStateComponent } from './error-state.component';

describe('ErrorStateComponent', () => {
  let component: ErrorStateComponent;
  let fixture: ComponentFixture<ErrorStateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ErrorStateComponent]
    });
    fixture = TestBed.createComponent(ErrorStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
