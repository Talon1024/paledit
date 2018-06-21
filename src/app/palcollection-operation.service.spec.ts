import { TestBed, inject } from '@angular/core/testing';

import { PalcollectionOperationService } from './palcollection-operation.service';

describe('PalcollectionOperationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PalcollectionOperationService]
    });
  });

  it('should be created', inject([PalcollectionOperationService], (service: PalcollectionOperationService) => {
    expect(service).toBeTruthy();
  }));
});
