import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftLogoComponent } from './left-logo.component';

describe('LeftLogoComponent', () => {
  let component: LeftLogoComponent;
  let fixture: ComponentFixture<LeftLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftLogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
