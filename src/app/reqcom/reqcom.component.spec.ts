import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqcomComponent } from './reqcom.component';

describe('ReqcomComponent', () => {
  let component: ReqcomComponent;
  let fixture: ComponentFixture<ReqcomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReqcomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqcomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
