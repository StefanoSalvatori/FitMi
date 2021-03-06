export enum GoalType {
  STEPS = 'Passi',
  DISTANCE = 'Distanza',
  TIME = 'Tempo',
  CALORIES = 'Calorie'
}

// tslint:disable-next-line: no-namespace
export namespace GoalType {
  export function getUnit(goalType: GoalType): string {
    switch (goalType) {
      case GoalType.STEPS:
        return 'passi';
      case GoalType.DISTANCE:
        return 'm';
      case GoalType.TIME:
        return 'min';
      case GoalType.CALORIES:
        return 'cal';
      default:
        return '';
    }
  }
}

export class Goal {

  // tslint:disable-next-line: variable-name
  constructor(private _type: GoalType, private _threshold: number) { }

  get type(): GoalType {
    return this._type;
  }

  set type(value: GoalType) {
    this._type = value;
  }

  get threshold(): number {
    return this._threshold;
  }

  set threshold(value: number) {
    this._threshold = value;
  }

  get unit(): string {
    return GoalType.getUnit(this._type);
  }

  get label(): string {
    return GoalType[this._type];
  }
}
