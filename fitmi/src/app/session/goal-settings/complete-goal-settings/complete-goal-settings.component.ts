import { Component, OnInit } from '@angular/core';
import {  ActivatedRoute, Router } from '@angular/router';

import  { GoalBufferService } from '../goal-buffer.service';
import { Goal } from '../goal';

@Component({
  selector: 'app-complete-goal-settings',
  templateUrl: './complete-goal-settings.component.html',
  styleUrls: ['./complete-goal-settings.component.scss'],
})
export class CompleteGoalSettingsComponent implements OnInit {

  private goalType = [
    {
      name: "distance",
      label: "Distanza",
      unit: "km"
    },
    {
      name: "calories",
      label: "Calorie",
      unit: "kCal"
    },
    {
      name: "steps",
      label: "Passi",
      unit: "passi"
    }
  ];

  private goal: Goal = new Goal(this.goalType[0].name, 0);

  constructor(private router: Router, private route: ActivatedRoute, private goalBuffer: GoalBufferService) { }

  ngOnInit() {}

  selectUnit(): string {
    this.goal.unit = this.goalType.find(goal => goal.name === this.goal.type).unit;
    return this.goal.unit;
  }

  startSession() {
    this.goalBuffer.changeMessage(this.goal);
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
