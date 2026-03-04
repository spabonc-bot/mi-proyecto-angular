import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scale } from './scale';

describe('Scale', () => {
  let component: Scale;
  let fixture: ComponentFixture<Scale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Scale]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Scale);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
