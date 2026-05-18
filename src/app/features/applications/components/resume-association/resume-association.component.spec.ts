import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeAssociationComponent } from './resume-association.component';

describe('ResumeAssociationComponent', () => {
  let component: ResumeAssociationComponent;
  let fixture: ComponentFixture<ResumeAssociationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ResumeAssociationComponent]
    });
    fixture = TestBed.createComponent(ResumeAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
