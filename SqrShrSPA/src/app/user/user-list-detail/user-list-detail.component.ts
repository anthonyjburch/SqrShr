import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-user-list-detail',
  templateUrl: './user-list-detail.component.html',
  styleUrls: ['./user-list-detail.component.scss']
})
export class UserListDetailComponent implements OnInit {
  @Input() user: User;
  constructor() { }

  ngOnInit() {
  }

}
