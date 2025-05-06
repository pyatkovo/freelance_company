import {Component, OnInit} from '@angular/core';
import {ArticleService} from "../../../shared/services/article.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ArticleType} from "../../../types/article.type";
import {AuthService} from "../../../core/auth/auth.service";
import {ArticleCardType} from "../../../types/article-card.type";
import {environment} from "../../../../environments/environment";
import {CommentsType} from "../../../types/comments.type";
import {CommentsService} from "../../../shared/services/comments.service";
import {DefaultResponseType} from "../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommentActionsType} from "../../../types/comment-actions.type";
import {HttpErrorResponse} from "@angular/common/http";
import {ArticleCommentActionsType} from "../../../types/article-comment-actions.type";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  serverStaticPath = environment.serverStaticPath;
  article!: ArticleType;
  isLogged: boolean = false;
  relatedArticles: ArticleCardType[] = [];
  href: string = "";
  textComment: string = '';
  commentActionsTypes = CommentActionsType;

  allComments: CommentsType['comments'] = []; // Все загруженные с сервера комментарии
  displayedComments: CommentsType['comments'] = []; // Те, что уже отрисованы

  totalCount = 0; // allCount с сервера
  offset = 0;
  loading = false;
  displayCount = 3;
  batchSize = 10;
  userCommentActions: { [commentId: string]: CommentActionsType } = {};

  constructor(private activatedRoute: ActivatedRoute, private articleService: ArticleService,
              private authService: AuthService,
              private router: Router,
              private commentsService: CommentsService,
              private _snackBar: MatSnackBar) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticle(params['url'])
        .subscribe((data: ArticleType) => {
          this.article = data;
          this.loadInitialComments();
        });

      this.articleService.getRelatedArticles(params['url'])
        .subscribe((relatedData: ArticleCardType[]) => {
          this.relatedArticles = relatedData;
        });

      this.href = window.location.origin + this.router.url;
    })

  }


  loadInitialComments(): void {
    this.loading = true;
    this.commentsService.getComments(this.article.id, 0).subscribe((response) => {
      this.totalCount = response.allCount;
      this.allComments = response.comments;
      this.displayedComments = this.allComments.slice(0, this.displayCount);
      this.offset = this.displayCount;
      this.loading = false;
      this.updateArticleActions();
    });

  }

  canShowMore(): boolean {
    return this.displayedComments.length < this.totalCount;
  }

  showMore(): void {
    this.loading = true;
    this.commentsService.getComments(this.article.id, this.offset).subscribe((response) => {
      const newComments = response.comments;
      this.allComments = [...this.allComments, ...newComments];
      this.displayedComments = [...this.displayedComments, ...newComments];
      this.offset += this.batchSize;
      this.loading = false;
    });

  }

  addComment() {
    if (this.textComment.trim()) {
      this.commentsService.addComment(this.article.id, this.textComment)
        .subscribe((data: DefaultResponseType) => {
          this._snackBar.open(data.message);
          this.textComment = '';
        })
    }
    this.loadInitialComments();
  }

  addAction(commentId: string, action: CommentActionsType): void {
    this.commentsService.addCommentAction(commentId, action).subscribe({
      next: (data: DefaultResponseType) => {
        if (!data.error) {
          this._snackBar.open('Ваш голос учтен!');

          // переключение состояния реакции
          const currentAction = this.userCommentActions[commentId];
          const comment = this.displayedComments.find(comment => comment.id === commentId);

          if (comment) {
            //если нынешняя реакция с прошлой реакцией совпали
            if (currentAction === action) {
              delete this.userCommentActions[commentId];
              if (action === CommentActionsType.like) comment.likesCount--;
              if (action === CommentActionsType.dislike) comment.dislikesCount--;
            } else {
              //если нынешняя реакция с прошлой реакцией не совпали
              if (currentAction === CommentActionsType.like) comment.likesCount--;
              if (currentAction === CommentActionsType.dislike) comment.dislikesCount--;

              this.userCommentActions[commentId] = action;
              if (action === CommentActionsType.like) comment.likesCount++;
              if (action === CommentActionsType.dislike) comment.dislikesCount++;
            }
          }
        }
      },
      error: (errorResponse: HttpErrorResponse) => {
        if(!this.isLogged){
          this._snackBar.open('Необходимо авторизоваться для действия');
          return
        }
        if (errorResponse.error?.message) {
          this._snackBar.open(errorResponse.error.message);
        } else {
          this._snackBar.open('Ошибка отправки запроса!');
        }
      }
    });
  }


  updateArticleActions(): void {
    this.commentsService.getArticleCommentActions(this.article.id).subscribe((actions: ArticleCommentActionsType[]) => {
      actions.forEach(({comment, action}) => {
        this.userCommentActions[comment] = action as CommentActionsType;
      });
    });
  }

  isLiked(commentId: string): boolean {
    return this.userCommentActions[commentId] === CommentActionsType.like;
  }

  isDisliked(commentId: string): boolean {
    return this.userCommentActions[commentId] === CommentActionsType.dislike;
  }

  sendReport(commentId:string, action: CommentActionsType.violate){
    this.commentsService.sendReport(commentId, action)
      .subscribe({
        next: (data: DefaultResponseType) => {
          if (!data.error) {
            this._snackBar.open(data.message + ' Жалоба была отправлена.');
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          if(!this.isLogged){
            this._snackBar.open('Необходимо авторизоваться для действия');
            return
          }
          if (errorResponse.error?.message) {
            this._snackBar.open(errorResponse.error.message + '. Жалоба уже отправлена');
          } else {
            this._snackBar.open('Ошибка отправки запроса!');
          }
        }
      })
  }


}
