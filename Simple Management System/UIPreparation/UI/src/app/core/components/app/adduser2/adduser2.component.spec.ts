/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Adduser2Component } from './adduser2.component';

describe('Adduser2Component', () => {
  let component: Adduser2Component;
  let fixture: ComponentFixture<Adduser2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Adduser2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Adduser2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
