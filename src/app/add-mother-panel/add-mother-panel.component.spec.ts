import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMotherPanelComponent } from './add-mother-panel.component';

describe('AddMotherPanelComponent', () => {
  let component: AddMotherPanelComponent;
  let fixture: ComponentFixture<AddMotherPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMotherPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMotherPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
