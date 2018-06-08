import { TestBed, inject } from '@angular/core/testing';

import { PlanillaService } from './planilla.service';

describe('PlanillaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlanillaService]
    });
  });

  it('should be created', inject([PlanillaService], (service: PlanillaService) => {
    expect(service).toBeTruthy();
  }));
});
