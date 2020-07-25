import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArenaConfigItemComponent } from './arena-config-item.component';

describe('ArenaConfigItemComponent', () => {
  let component: ArenaConfigItemComponent;
  let fixture: ComponentFixture<ArenaConfigItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArenaConfigItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArenaConfigItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
