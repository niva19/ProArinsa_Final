import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenteBridgeComponent } from './gerente-bridge.component';

describe('GerenteBridgeComponent', () => {
  let component: GerenteBridgeComponent;
  let fixture: ComponentFixture<GerenteBridgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GerenteBridgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GerenteBridgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
