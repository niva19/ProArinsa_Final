import { TestBed, inject } from '@angular/core/testing';

import { ArchivosService } from './archivos.service';

describe('ArchivosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArchivosService]
    });
  });

  it('should be created', inject([ArchivosService], (service: ArchivosService) => {
    expect(service).toBeTruthy();
  }));
});
