import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-delete-icon',
    templateUrl: './delete-icon.component.html',
    styleUrls: ['./delete-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager
})
export class DeleteIconComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
