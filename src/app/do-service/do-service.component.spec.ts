import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoServiceComponent } from './do-service.component';

describe('DoServiceComponent', () => {
  let component: DoServiceComponent;
  let fixture: ComponentFixture<DoServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
