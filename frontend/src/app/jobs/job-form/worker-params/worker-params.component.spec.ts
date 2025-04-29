// Copyright 2018 Google Inc
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkersService } from '../../shared/workers.service';
import { WorkerParamsComponent } from './worker-params.component';

describe('WorkerParamsComponent', () => {
  let component: WorkerParamsComponent;
  let fixture: ComponentFixture<WorkerParamsComponent>;
  const formBuilder: UntypedFormBuilder = new UntypedFormBuilder();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule
      ],
      providers: [
        WorkersService,
        // reference the new instance of formBuilder from above
        { provide: UntypedFormBuilder, useValue: formBuilder }
      ],
      declarations: [ WorkerParamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkerParamsComponent);
    component = fixture.componentInstance;
    // pass in the form dynamically
    component.jobForm = formBuilder.group({
      paramsLairs: formBuilder.array([
        formBuilder.group({name: 'param1', value: 'foo'}),
        formBuilder.group({name: 'param2', value: 'bar'}),
      ])
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
