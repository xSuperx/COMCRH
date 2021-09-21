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
      vFormat: 'Hour',
    };
  }

  initialData() {
    return [
      {
        pID: 1,
        pName: 'Define Chart API',
        pStart: '',
        pEnd: '',
        pClass: 'ggroupblack',
        pLink: '',
        pMile: 0,
        pRes: 'Brian',
        pComp: 0,
        pGroup: 1,
        pParent: 0,
        pOpen: 1,
        pDepend: '',
        pCaption: '',
        pNotes: 'Some Notes text',
      },
    ];
  }
}
