import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditwebsiteComponent } from './editwebsite.component';

describe('EditwebsiteComponent', () => {
  let component: EditwebsiteComponent;
  let fixture: ComponentFixture<EditwebsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditwebsiteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditwebsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
