import { Component, Input, OnInit } from '@angular/core';
import { tabInfo } from '@data/schema/create-candidate';
import { trigger, style, animate, transition, state, group } from '@angular/animations';

@Component({
  selector: 'app-create-candidate-personal-details',
  templateUrl: './create-candidate-personal-details.component.html',
  styleUrls: ['./create-candidate-personal-details.component.css'],
  animations: [
    trigger('slideInOut', [
        state('in', style({height: '*', opacity: 0})),
        transition(':leave', [
            style({height: '*', opacity: 1}),

            group([
                animate(300, style({height: 0})),
                animate('200ms ease-in-out', style({'opacity': '0'}))
            ])

        ]),
        transition(':enter', [
            style({height: '0', opacity: 0}),

            group([
                animate(300, style({height: '*'})),
                animate('400ms ease-in-out', style({'opacity': '1'}))
            ])

        ])
    ])
]
})
export class CreateCandidatePersonalDetailsComponent implements OnInit {

  @Input() currentTabInfo: tabInfo;

  show:boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
