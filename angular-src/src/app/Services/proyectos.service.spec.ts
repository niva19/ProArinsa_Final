import { TestBed, inject } from '@angular/core/testing';

import { ProyectosService } from './proyectos.service';

describe('ProyectosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProyectosService]
    });
  });

  it('should be created', inject([ProyectosService], (service: ProyectosService) => {
    expect(service).toBeTruthy();
  }));
});
