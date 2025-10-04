import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwcaccountComponent } from './awcaccount.component';

describe('AwcaccountComponent', () => {
  let component: AwcaccountComponent;
  let fixture: ComponentFixture<AwcaccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AwcaccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AwcaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
