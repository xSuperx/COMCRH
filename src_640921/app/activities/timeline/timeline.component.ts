import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { GanttEditorComponent, GanttEditorOptions } from 'ng-gantt';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit {
  @ViewChild('editor') editor: GanttEditorComponent;
  public editorOptions: GanttEditorOptions;
  public data: any;

  constructor(public fb: FormBuilder) {}

  ngOnInit() {
    this.data = this.initialData();
    this.editorOptions = {
      vFormat: 'hour',
      vShowRes: 1,
      vShowCost: 0,
      vShowComp: 0,
      vShowDur: 0,
      vShowStartDate: 0,
      vShowEndDate: 0,
      vShowPlanStartDate: 0,
      vShowPlanEndDate: 0,
      vShowTaskInfoLink: 0,
      vShowEndWeekDate: 0,
    };
  }

  initialData() {
    return [
      {
        pID: 1,
        pName: 'ทดสอบรายการที่ 1',
        pStart: '2020-07-03 08:00',
        pEnd: '2020-07-03 08:15',
        pClass: 'gtaskblue',
        // pLink: '',
        // pMile: 0,
        // pRes: 'Brian',
        // pComp: 0,
        // pGroup: 0,
        // pParent: 0,
        // pOpen: 0,
        // pDepend: '',
        // pCaption: '',
        // pNotes: 'Some Notes text',
      },
      {
        pID: 2,
        pName: 'ทดสอบรายการที่ 2',
        pStart: '2020-07-03 08:15',
        pEnd: '2020-07-03 08:35',
        pClass: 'gtaskblue',
      },
      {
        pID: 3,
        pName: 'ทดสอบรายการที่ 3',
        pStart: '2020-07-03 13:15',
        pEnd: '2020-07-03 14:35',
        pClass: 'gtaskblue',
      },
      {
        pID: 4,
        pName: 'ทดสอบรายการที่ 4',
        pStart: '2020-07-03 16:29',
        pEnd: '2020-07-03 16:30',
        pClass: 'gtaskblue',
      },
    ];
  }

}
