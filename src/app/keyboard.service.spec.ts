import { TestBed, inject } from '@angular/core/testing';

import { KeyboardService, KeyState } from './keyboard.service';

describe('KeyboardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KeyboardService]
    });
  });

  it('should be created', inject([KeyboardService], (service: KeyboardService) => {
    expect(service).toBeTruthy();
  }));
  it('should filter key presses', inject([KeyboardService], (service: KeyboardService) => {
    const invalidEvent = new KeyboardEvent('keydown', {
      'key': 'C'
    });
    const validEvent = new KeyboardEvent('keydown', {
      'key': 'Shift'
    });
    const listener = service.observeKeyboard(['Control', 'Shift']).subscribe((keyState: KeyState) => {
      if (keyState.key === 'Shift') { expect(keyState).toBeTruthy(); }
    });
    document.dispatchEvent(invalidEvent);
    document.dispatchEvent(validEvent);
  }));
});
