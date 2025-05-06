import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

import {CommentsType} from "../../types/comments.type";
import {HttpClient} from "@angular/common/http";
import {DefaultResponseType} from "../../types/default-response.type";
import {CommentActionsType} from "../../types/comment-actions.type";
import {ArticleCommentActionsType} from "../../types/article-comment-actions.type";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) { }


  getComments(articleId: string, offset: number): Observable<CommentsType> {
    return this.http.get<CommentsType>(`${environment.api}comments?offset=${offset}&article=${articleId}`);
  }

  addComment(article: string, text: string) {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', { text, article });
  }

  addCommentAction(articleId: string, action: CommentActionsType){
    return this.http.post<DefaultResponseType>(environment.api + `comments/${articleId}/apply-action`, { action });
  }

  getArticleCommentActions(articleId: string){
    return this.http.get<ArticleCommentActionsType[]>(environment.api + `comments/article-comment-actions?articleId=${articleId}`)
  }

  sendReport(articleId: string, action: CommentActionsType){
    return this.http.post<DefaultResponseType>(environment.api + `comments/${articleId}/apply-action`, { action });
  }
}
