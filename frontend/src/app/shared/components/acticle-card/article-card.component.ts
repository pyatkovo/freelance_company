import {Component, Input, OnInit} from '@angular/core';
import {ArticleCardType} from "../../../types/article-card.type";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent implements OnInit {
  @Input() article!: ArticleCardType;
  serverStaticPath = environment.serverStaticPath;

  constructor() { }

  ngOnInit(): void {
  }

}
