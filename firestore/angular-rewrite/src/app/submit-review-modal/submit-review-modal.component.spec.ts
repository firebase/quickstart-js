import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitReviewModalComponent } from './submit-review-modal.component';

describe('SubmitReviewModalComponent', () => {
  let component: SubmitReviewModalComponent;
  let fixture: ComponentFixture<SubmitReviewModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubmitReviewModalComponent]
    });
    fixture = TestBed.createComponent(SubmitReviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
