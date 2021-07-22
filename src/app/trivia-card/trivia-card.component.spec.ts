import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriviaCardComponent } from './trivia-card.component';

describe('TriviaCardComponent', () => {
  let component: TriviaCardComponent;
  let fixture: ComponentFixture<TriviaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TriviaCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TriviaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
