import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicelogComponent } from './servicelog.component';

describe('ServicelogComponent', () => {
  let component: ServicelogComponent;
  let fixture: ComponentFixture<ServicelogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicelogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicelogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
