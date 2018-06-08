import { TestBed, inject } from '@angular/core/testing';

import { CarpetasService } from './carpetas.service';

describe('CarpetasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CarpetasService]
    });
  });

  it('should be created', inject([CarpetasService], (service: CarpetasService) => {
    expect(service).toBeTruthy();
  }));
});
