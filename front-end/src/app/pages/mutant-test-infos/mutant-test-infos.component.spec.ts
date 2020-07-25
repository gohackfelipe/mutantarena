import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MutantTestInfosComponent } from './mutant-test-infos.component';

describe('MutantTestInfosComponent', () => {
  let component: MutantTestInfosComponent;
  let fixture: ComponentFixture<MutantTestInfosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MutantTestInfosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutantTestInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
