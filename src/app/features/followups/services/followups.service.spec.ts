import { TestBed } from '@angular/core/testing';

import { FollowupsService } from './followups.service';

describe('FollowupsService', () => {
  let service: FollowupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FollowupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
