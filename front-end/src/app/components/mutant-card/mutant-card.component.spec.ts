import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MutantCardComponent } from './mutant-card.component';

describe('MutantCardComponent', () => {
  let component: MutantCardComponent;
  let fixture: ComponentFixture<MutantCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MutantCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutantCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
