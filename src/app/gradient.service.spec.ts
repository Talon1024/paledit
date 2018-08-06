import { TestBed, inject } from '@angular/core/testing';

import { GradientService } from './gradient.service';

describe('GradientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GradientService]
    });
  });

  it('should be created', inject([GradientService], (service: GradientService) => {
    expect(service).toBeTruthy();
  }));
});
