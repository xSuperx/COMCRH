import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppsetupComponent } from './appsetup.component';

describe('AppsetupComponent', () => {
  let component: AppsetupComponent;
  let fixture: ComponentFixture<AppsetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppsetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppsetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
