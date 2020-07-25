import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalArenaComponent } from './modal-arena.component';

describe('ModalArenaComponent', () => {
  let component: ModalArenaComponent;
  let fixture: ComponentFixture<ModalArenaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalArenaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalArenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
