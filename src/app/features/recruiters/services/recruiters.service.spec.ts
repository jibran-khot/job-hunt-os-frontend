import { TestBed } from '@angular/core/testing';

import { RecruitersService } from './recruiters.service';

describe('RecruitersService', () => {
  let service: RecruitersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecruitersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
