import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArenaItemComponent } from './arena-item.component';

describe('ArenaItemComponent', () => {
  let component: ArenaItemComponent;
  let fixture: ComponentFixture<ArenaItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArenaItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArenaItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
