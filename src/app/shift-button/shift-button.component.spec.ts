import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftButtonComponent } from './shift-button.component';

describe('ShiftButtonComponent', () => {
  let component: ShiftButtonComponent;
  let fixture: ComponentFixture<ShiftButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
