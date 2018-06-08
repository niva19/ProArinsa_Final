import { TestBed, inject } from '@angular/core/testing';

import { IngresarService } from './ingresar.service';

describe('IngresarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IngresarService]
    });
  });

  it('should be created', inject([IngresarService], (service: IngresarService) => {
    expect(service).toBeTruthy();
  }));
});
