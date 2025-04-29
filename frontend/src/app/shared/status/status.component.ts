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

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.sass']
})
export class StatusComponent implements OnInit {
  @Input() status;
  classStatusColor = 'idle';
  iconMapping = {
    'idle': 'clock',
    'succeeded': 'check-circle-outline',
    'waiting': 'pause-circle-outline',
    'running': 'play-circle-outline',
    'stopping': 'stop-circle-outline',
    'failed': 'close-circle-outline',
    'finished': 'check-circle-outline'
  };
  classIcon = '';

  constructor() { }

  ngOnInit() {
    this.changeClassStatusColor();
  }

  changeClassStatusColor() {
    this.classStatusColor = `crmi-status crmi-status-${this.status}`;
    this.classIcon = 'mdi mdi-' + this.iconMapping[this.status];
  }

}
