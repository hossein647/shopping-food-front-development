import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Comment } from '../_interfaces/comment.interface';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  apiAddres = environment.url;

  constructor(
    private http: HttpClient,
  ) { }


  create(comment: Comment) {    
    return this.http.post(`${this.apiAddres}/comment/create`, comment, { withCredentials: true })
    .pipe(
      catchError(err => of(err))
    )
  }



  replayComment(body: Comment, mainId: number) {    
    const params = new HttpParams().set('mainId', mainId);

    return this.http.post(`${this.apiAddres}/comment/replay`, body, { params, withCredentials: true })
    .pipe(
      catchError(err => of(err))
    )
  }


  
}
