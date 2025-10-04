import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVerficationComponent } from './email-verfication.component';

describe('EmailVerficationComponent', () => {
  let component: EmailVerficationComponent;
  let fixture: ComponentFixture<EmailVerficationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailVerficationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailVerficationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
