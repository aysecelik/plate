import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SahtePlakalarComponent } from './sahte-plakalar.component';

describe('SahtePlakalarComponent', () => {
  let component: SahtePlakalarComponent;
  let fixture: ComponentFixture<SahtePlakalarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SahtePlakalarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SahtePlakalarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
