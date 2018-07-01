import { TestBed, inject } from '@angular/core/testing';

import { WadReaderService } from './wad-reader.service';

describe('WadReaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WadReaderService]
    });
  });

  it('should be created', inject([WadReaderService], (service: WadReaderService) => {
    expect(service).toBeTruthy();
  }));
});
