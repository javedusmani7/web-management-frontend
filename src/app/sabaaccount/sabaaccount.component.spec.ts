import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SabaaccountComponent } from './sabaaccount.component';

describe('SabaaccountComponent', () => {
  let component: SabaaccountComponent;
  let fixture: ComponentFixture<SabaaccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SabaaccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SabaaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
