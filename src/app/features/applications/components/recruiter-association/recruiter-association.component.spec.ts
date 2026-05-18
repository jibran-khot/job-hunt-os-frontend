import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterAssociationComponent } from './recruiter-association.component';

describe('RecruiterAssociationComponent', () => {
  let component: RecruiterAssociationComponent;
  let fixture: ComponentFixture<RecruiterAssociationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RecruiterAssociationComponent]
    });
    fixture = TestBed.createComponent(RecruiterAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
