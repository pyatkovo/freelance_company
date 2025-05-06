import { Component, OnInit } from '@angular/core';
import {PopupService} from "../../services/popup.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private popupService: PopupService) { }

  ngOnInit(): void {
  }

  scrollTo(fragment: string) {
    setTimeout(() => {
      document.getElementById(fragment)?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  openPopup(type: 'order' | 'consultation', category?: string) {
    this.popupService.open(type, category || null);
  }
}
