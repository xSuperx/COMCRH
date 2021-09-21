import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqrepComponent } from './reqrep.component';

describe('ReqrepComponent', () => {
  let component: ReqrepComponent;
  let fixture: ComponentFixture<ReqrepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReqrepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqrepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
