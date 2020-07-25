import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MutantConfigItemComponent } from './mutant-config-item.component';

describe('MutantConfigItemComponent', () => {
  let component: MutantConfigItemComponent;
  let fixture: ComponentFixture<MutantConfigItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MutantConfigItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutantConfigItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
