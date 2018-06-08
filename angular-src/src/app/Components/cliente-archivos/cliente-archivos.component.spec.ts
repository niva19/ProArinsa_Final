import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteArchivosComponent } from './cliente-archivos.component';

describe('ClienteArchivosComponent', () => {
  let component: ClienteArchivosComponent;
  let fixture: ComponentFixture<ClienteArchivosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClienteArchivosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteArchivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
