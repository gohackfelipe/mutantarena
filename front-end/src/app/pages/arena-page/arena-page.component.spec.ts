import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArenaPageComponent } from './arena-page.component';

describe('ArenaPageComponent', () => {
  let component: ArenaPageComponent;
  let fixture: ComponentFixture<ArenaPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArenaPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArenaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
