import { TestBed, inject } from '@angular/core/testing';

import { PaletteSelectionService } from './palette-selection.service';

describe('PaletteSelectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaletteSelectionService]
    });
  });

  it('should be created', inject([PaletteSelectionService], (service: PaletteSelectionService) => {
    expect(service).toBeTruthy();
  }));
});
