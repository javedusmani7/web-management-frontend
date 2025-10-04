import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotherPanelComponent } from './mother-panel.component';

describe('MotherPanelComponent', () => {
  let component: MotherPanelComponent;
  let fixture: ComponentFixture<MotherPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotherPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotherPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
