import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap, toArray } from 'rxjs/operators';
import { Upload } from './upload.model';
import { UploadStore } from './upload.store';
import { Role } from 'src/app/auth/state/user.model';
import { concat, forkJoin, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UploadService {

  baseApi = environment.url;
  constructor(
    private uploadStore: UploadStore, 
    private http: HttpClient
    ) {}

  uploadImage(file: any, shop: string) {
    const params = new HttpParams().set('shop', shop)
    const formData = new FormData();
    for (let i = 0; i < file.length; i++) {
      formData.append('images', file[i]);
    }
    return this.http.post<Upload>(`${this.baseApi}/file-upload/image`, formData, 
      { params, withCredentials: true });
  }
  
  
  uploadProfileImage(file: any, id: number) {
    const params = new HttpParams().set('id', id)
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post(`${this.baseApi}/file-upload/img-profile`, 
    formData, { params, withCredentials: true })
    .pipe(
      catchError(err => of(err))
    )
  }


  getAllPrivate() {
    return this.http.get<Upload[]>(`${this.baseApi}/file-upload/all-private`, { withCredentials: true })
    .pipe(
      tap(entitiesImage => {
        this.uploadStore.set(entitiesImage);
      })
    )
  }
  
  
  
  // getAllPublicById(id: number, shop: string) {    
  //   const params = new HttpParams()
  //   .set('id', id)
  //   .set('shop', shop);

  //   return this.http.get(`${this.baseApi}/file-upload/all-public/id-and-shop`, { params })
  //   .pipe(
  //     catchError(err => of(err))
  //   )
  // }
  
  
  getAllPublic() {
    return this.http.get<Upload[]>(`${this.baseApi}/file-upload/all-public`)
    .pipe(
      tap(entitiesImage => {
        this.uploadStore.set(entitiesImage);
      })
    )
  }
  



  // get(imageName: string, status: string, id?: string, role?: string) {    
  //   const params = new HttpParams()
  //   .set('imageName', imageName)
  //   .set('id', id || 0)
  //   .set('role', role || '');
  //   let withCredentials = status === 'single-private' ? true : false;
    
  //   return this.http.get(`${this.baseApi}/file-upload/${status}`, {
  //     params, 
  //     responseType: 'blob',
  //     withCredentials
  //   });
  // }



  // getSinglePublic(imageName: string) {
  //   const params = new HttpParams().set('imageName', imageName)
  //   return this.http.get(`${this.baseApi}/file-upload/single-public/by-name`, { params })
  //   .pipe(
  //     catchError(err => of(err))
  //   )
  // }
  

  remove(id: number) {
    return this.http.delete<Upload>(`${this.baseApi}/file-upload/remove/${id}`, 
      { withCredentials: true });
  }


  getImageProfile() {
      return this.http.get(`${this.baseApi}/file-upload/profile-image`, { withCredentials: true })
      .pipe(
        catchError(err => of(err))
      )
  }

}
