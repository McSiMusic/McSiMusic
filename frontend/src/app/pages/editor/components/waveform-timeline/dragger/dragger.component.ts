import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dragger',
  templateUrl: './dragger.component.html',
  styleUrls: ['./dragger.component.scss']
})
export class DraggerComponent implements OnInit {
  @Input() isPrimary = false;
  @Input() isGrabbing = false;

  constructor() { }

  ngOnInit(): void {
  }

}
