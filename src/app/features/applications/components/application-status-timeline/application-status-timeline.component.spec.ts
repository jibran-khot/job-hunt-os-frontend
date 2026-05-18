import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationStatusTimelineComponent } from './application-status-timeline.component';

describe('ApplicationStatusTimelineComponent', () => {
  let component: ApplicationStatusTimelineComponent;
  let fixture: ComponentFixture<ApplicationStatusTimelineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApplicationStatusTimelineComponent]
    });
    fixture = TestBed.createComponent(ApplicationStatusTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
