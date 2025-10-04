import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudflareAccountComponent } from './cloudflare-account.component';

describe('CloudflareAccountComponent', () => {
  let component: CloudflareAccountComponent;
  let fixture: ComponentFixture<CloudflareAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloudflareAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloudflareAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
