import { Component, OnInit, ViewChild } from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @ViewChild(MatAccordion)
  accordion: MatAccordion = new MatAccordion;

  constructor() { }

  ngOnInit(): void {
  }

  language = 'EN';
}