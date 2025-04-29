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

import { Type } from 'class-transformer';
import * as parser from 'cron-parser';
import * as moment from 'moment';

import { Schedule } from './schedule';
import { Param } from './param';

export class Pipeline {
  id: number;
  name: string;
  emails_for_notifications: string | null;
  status: string;
  updated_at: string;
  run_on_schedule: boolean;
  has_jobs: boolean;

  @Type(() => Schedule)
  schedules: Schedule[] = [];

  @Type(() => Param)
  params: Param[] = [];

  constructor(data?: Partial<Pipeline>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  blocked_running(): boolean {
    return false; // Allow manual execution regardless of the run_on_schedule flag
  }

  blocked_stopping(): boolean {
    return this.status === 'stopping';
  }

  showed_stopping(): boolean {
    return ['running', 'stopping'].includes(this.status);
  }

  is_active(): boolean {
    return ['running', 'stopping'].includes(this.status);
  }

  showed_running(): boolean {
    return ['idle', 'finished', 'failed', 'succeeded'].includes(this.status);
  }

  blocked_managing(): boolean {
    return this.run_on_schedule || ['running', 'stopping'].includes(this.status);
  }

  run_on_schedule_next_date(showText = false): string {
    let text = showText ? 'Run on schedule' : '';
    if (this.run_on_schedule) {
      let nextDate: Date | null = null;
  
      this.schedules.forEach((schedule) => {
        try {
          const interval = parser.parseExpression(schedule.cron, { utc: true });
          const scheduleNextDate = interval.next().toDate();
          if (!nextDate || scheduleNextDate < nextDate) {
            nextDate = scheduleNextDate;
          }
        } catch (err) {
          console.error(`Invalid cron in schedule ${schedule.id}:`, schedule.cron);
        }
      });
  
      if (nextDate) {
        const nextDateString = moment(nextDate).calendar();
        text += ' ' + nextDateString.charAt(0).toLowerCase() + nextDateString.slice(1);
      } else {
        text += ' no valid schedules';
      }
    }
    return text;
  }
}
