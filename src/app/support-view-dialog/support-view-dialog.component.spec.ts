import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportViewDialogComponent } from './support-view-dialog.component';

describe('SupportViewDialogComponent', () => {
  let component: SupportViewDialogComponent;
  let fixture: ComponentFixture<SupportViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportViewDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
