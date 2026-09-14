import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupSubmitComponent } from './signup-submit.component';

describe('SignupSubmitComponent', () => {
  let component: SignupSubmitComponent;
  let fixture: ComponentFixture<SignupSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupSubmitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
