import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ViewportScroller} from "@angular/common";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss']
})
export class PolicyComponent implements OnInit, AfterViewInit {

  constructor(private viewportScroller: ViewportScroller, private route: ActivatedRoute) {}

  ngAfterViewInit(): void {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => {
          this.viewportScroller.scrollToAnchor(fragment);
        }, 100);
      }
    });
  }

  ngOnInit(): void {

  }

}
