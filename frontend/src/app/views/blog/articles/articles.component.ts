import {Component, HostListener, OnInit} from '@angular/core';
import {ArticleCardType} from "../../../types/article-card.type";
import {ArticleService} from "../../../shared/services/article.service";
import {CategoryService} from "../../../shared/services/category.service";
import {CategoryType} from "../../../types/category.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsType} from "../../../types/active-params.type";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
  isOpen = false;
  categories: CategoryType[] = [];
  articles: ArticleCardType[] = []
  selectedCategories: CategoryType[] = [];
  activeParams: ActiveParamsType = {categories:[]};
  pages: number[] = [];

  constructor(private articleService: ArticleService, private categoryService: CategoryService, private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;

      this.activatedRoute.queryParams
        .pipe(debounceTime(300)) //задержка чтобы не было перегруза запросов
        .subscribe(params => {
        const selectedCategoryUrls = params['categories'] || [];

        // Преобразуем массив URL категорий в массив объектов категорий
        this.selectedCategories = this.categories.filter(category =>
          selectedCategoryUrls.includes(category.url)
        );

        this.activeParams = {
          categories: selectedCategoryUrls.length ? selectedCategoryUrls : [],
          page: params['page'] ? +params['page'] : 1
        };

        this.articleService.getArticles(this.activeParams)
          .subscribe(articlesData => {
          this.articles = articlesData.items;
          this.pages = [];
          for (let i = 1; i <= articlesData.pages; i++) {
            this.pages.push(i)
          }
        });
      });
    });
  }


  toggleFilter() {
    this.isOpen = !this.isOpen;
  }

  selectCategory(category: CategoryType) {
    if (this.isSelected(category)) {
      this.selectedCategories = this.selectedCategories.filter(
        selectedCategory => selectedCategory.id !== category.id
      );
    } else {
      this.selectedCategories.push(category);
    }
    console.log(this.selectedCategories);
    this.updateQueryParams();
  }


  isSelected(category: CategoryType): boolean {
    return this.selectedCategories.some(
      selectedCategory => selectedCategory.id === category.id
    );
  }

  updateQueryParams() {
    const categoryUrls = this.selectedCategories.map(category => category.url);

    this.router.navigate(['/articles'], {
      queryParams: { categories: categoryUrls },
      queryParamsHandling: 'merge',
    }).then(() => {
      this.router.navigate(['/articles'], {
        queryParams: { page: null },
        queryParamsHandling: 'merge',
      });
    });
  }


  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    })
  }

  openNextPage() {
    if (!this.activeParams.page){
      this.activeParams.page = 1;
    }
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/articles'], {
        queryParams: this.activeParams
      })
    }
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/articles'], {
        queryParams: this.activeParams
      })
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.isOpen && !(event.target as HTMLElement).closest('.blog-filters')) {
      this.isOpen = false;
    }
  }
}
