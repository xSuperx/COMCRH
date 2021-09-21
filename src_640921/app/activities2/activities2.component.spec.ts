import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Activities2Component } from './activities2.component';

describe('Activities2Component', () => {
  let component: Activities2Component;
  let fixture: ComponentFixture<Activities2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Activities2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Activities2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
