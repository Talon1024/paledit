import { TestBed, inject } from '@angular/core/testing';

import { PaletteOperationService } from './palette-operation.service';

describe('PaletteOperationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaletteOperationService]
    });
  });

  it('should be created', inject([PaletteOperationService], (service: PaletteOperationService) => {
    expect(service).toBeTruthy();
  }));
});
