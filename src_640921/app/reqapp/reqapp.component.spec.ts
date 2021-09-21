import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqappComponent } from './reqapp.component';

describe('ReqappComponent', () => {
  let component: ReqappComponent;
  let fixture: ComponentFixture<ReqappComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReqappComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
