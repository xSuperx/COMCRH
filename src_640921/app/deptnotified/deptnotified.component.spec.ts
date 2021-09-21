import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptnotifiedComponent } from './deptnotified.component';

describe('DeptnotifiedComponent', () => {
  let component: DeptnotifiedComponent;
  let fixture: ComponentFixture<DeptnotifiedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeptnotifiedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeptnotifiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
