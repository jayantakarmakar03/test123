import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubownerComponent } from './clubowner.component';

describe('ClubownerComponent', () => {
  let component: ClubownerComponent;
  let fixture: ComponentFixture<ClubownerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubownerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubownerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
