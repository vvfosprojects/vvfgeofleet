import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosizioneMezzoComponent } from './posizione-mezzo.component';

describe('PosizioneMezzoComponent', () => {
  let component: PosizioneMezzoComponent;
  let fixture: ComponentFixture<PosizioneMezzoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosizioneMezzoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosizioneMezzoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
