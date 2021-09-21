import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelreqappComponent } from './panelreqapp.component';

describe('PanelreqappComponent', () => {
  let component: PanelreqappComponent;
  let fixture: ComponentFixture<PanelreqappComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelreqappComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelreqappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
