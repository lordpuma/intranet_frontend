import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftsGridComponent } from './shifts-grid.component';

describe('ShiftsGridComponent', () => {
  let component: ShiftsGridComponent;
  let fixture: ComponentFixture<ShiftsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
