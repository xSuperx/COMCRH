import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqanswerComponent } from './reqanswer.component';

describe('ReqanswerComponent', () => {
  let component: ReqanswerComponent;
  let fixture: ComponentFixture<ReqanswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReqanswerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqanswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
