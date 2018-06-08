import { TestBed, inject } from '@angular/core/testing';

import { ClienteArchivosService } from './cliente-archivos.service';

describe('ClienteArchivosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClienteArchivosService]
    });
  });

  it('should be created', inject([ClienteArchivosService], (service: ClienteArchivosService) => {
    expect(service).toBeTruthy();
  }));
});
