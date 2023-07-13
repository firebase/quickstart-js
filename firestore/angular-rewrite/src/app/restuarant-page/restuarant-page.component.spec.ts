import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestuarantPageComponent } from './restuarant-page.component';

describe('RestuarantPageComponent', () => {
  let component: RestuarantPageComponent;
  let fixture: ComponentFixture<RestuarantPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestuarantPageComponent]
    });
    fixture = TestBed.createComponent(RestuarantPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
