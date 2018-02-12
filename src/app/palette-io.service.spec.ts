import { TestBed, inject } from '@angular/core/testing';

import { PaletteIoService } from './palette-io.service';

describe('PaletteIoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaletteIoService]
    });
  });

  it('should be created', inject([PaletteIoService], (service: PaletteIoService) => {
    expect(service).toBeTruthy();
  }));
});
