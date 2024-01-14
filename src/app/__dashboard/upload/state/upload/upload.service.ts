import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { Upload } from './upload.model';
import { UploadStore } from './upload.store';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { Setting } from 'src/app/___share/interface/setting.interface';

@Injectable({ providedIn: 'root' })
export class UploadService {

  baseApi = environment.url;
  private uploadCenter = new BehaviorSubject<any>({ setting: { uploadCenter: '' } });
  uploadCenter$ = this.uploadCenter.asObservable();

  constructor(
    private uploadStore: UploadStore, 
    private http: HttpClient
    ) {}


  uploadImage(file: any, uploadCenter: string) {
    const formData = new FormData();
    for (let i = 0; i < file.length; i++) {
      formData.append('images', file[i]);
    }
    return this.http.post<Upload>(`${this.baseApi}/file-upload/image-${uploadCenter}`, formData, 
      { withCredentials: true });
  }
  
  
  uploadProfileImage(file: any, dataImage: any) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('dataImage', JSON.stringify(dataImage));

    return this.http.post(`${this.baseApi}/file-upload/img-profile-${dataImage.setting.uploadCenter}`, 
    formData, { withCredentials: true })
    .pipe(
      catchError(err => of(err))
    )
  }
  


  getAllGallery(uploadCenter: string) {    
    return this.http.get<Upload[]>(`${this.baseApi}/file-upload/all-gallery-${uploadCenter}`, { withCredentials: true })
    .pipe(
      tap(entitiesImage => {
        this.uploadStore.set(entitiesImage);
      })
    )
  }
  
  
  
  getAllPublic() {
    return this.http.get<Upload[]>(`${this.baseApi}/file-upload/all-public`)
    .pipe(
      tap(entitiesImage => {
        this.uploadStore.set(entitiesImage);
      })
    )
  }
  

  remove(id: string, uploadCenter: string, key?: string) {
    const params = new HttpParams()
    .set('id', id)
    .set('key', key || '')
    .set('uploadCenter', uploadCenter);

    return this.http.delete<Upload>(`${this.baseApi}/file-upload/remove-${uploadCenter}`, { params, withCredentials: true })
      .pipe(
        catchError(err => throwError(() => of(err)))
      );
  }


  getImageProfile(key: string) {
    const params = new HttpParams().set('key', key);
      return this.http.get(`${this.baseApi}/file-upload/profile-image/get`, { params, withCredentials: true })
      .pipe(
        tap((res: any) => {          
          this.setUploadCenter(res.setting);
          return res
        }),
        catchError(err => throwError(() => of(err)))
      )
  }


  setUploadCenter(setting: Setting) {
    this.uploadCenter.next({ setting });
  }
}
