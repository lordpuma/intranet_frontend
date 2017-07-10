import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkplaceFormComponent } from './workplace-form.component';

describe('WorkplaceFormComponent', () => {
  let component: WorkplaceFormComponent;
  let fixture: ComponentFixture<WorkplaceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkplaceFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkplaceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
