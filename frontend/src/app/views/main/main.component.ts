import { Component, OnInit } from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ArticleService} from "../../shared/services/article.service";
import {ArticleCardType} from "../../types/article-card.type";
import {PopupService} from "../../shared/services/popup.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  articles: ArticleCardType[] = [];

  constructor(private articleService: ArticleService, private popupService: PopupService) { }
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    autoplay: true,
    smartSpeed: 700,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
    },
    nav: false
  }

  customOptionsReviews: OwlOptions = {
    loop: true,
    margin: 25,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    smartSpeed: 700,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      }
    },
    nav: false
  }

  reviews = [
    {
      name: 'Станислав',
      image: 'review1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      name: 'Ирина',
      image: 'review2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      name: 'Мария',
      image: 'review3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },
    {
      name: 'Олег',
      image: 'review4.png',
      text: 'Сотрудничество с АйтиШтормом - одно из лучших решений для моего проекта. Их материалы не просто качественные, а действительно цепляют.'
    },
    {
      name: 'Александра',
      image: 'review5.png',
      text: 'АйтиШторм помог мне переосмыслить подход к личному бренду. Я раньше думала, что это просто красивая картинка, а оказалось - это глубокая, продуманная стратегия. Огромное спасибо за это открытие!'
    },
  ]

  ngOnInit(): void {
    this.articleService.getTopArticles()
      .subscribe((data: ArticleCardType[]) => {
        this.articles = data;
        console.log(data);
      })
  }

  openPopup(type: 'order' | 'consultation', category?: string) {
    this.popupService.open(type, category || null);
  }

}
