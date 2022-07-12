import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Food } from 'src/app/__dashboard/foods/state/food.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CircularService {

  baseApi = environment.url;
  urlImage: any;

  constructor(
    private http: HttpClient) 
    {}


  
  getConfirmToday() {
    return this.http.get<Food[]>(`${this.baseApi}/foods/getAll/confirm`, { withCredentials: true });
  }


  getShowStates() {
    return this.http.get<Food[]>(`${this.baseApi}/foods/getAll/show`, { withCredentials: true });
  }
  

  updateToShowState(id: number) {
    return this.http.put<Food>(`${this.baseApi}/foods/update/show`, { id }, { withCredentials: true });
  }

  
  updateToCompleteState() {
    return this.http.put<Food[]>(`${this.baseApi}/foods/update/complete`, {}, { withCredentials: true });
  }


  getImageFood(id: number, imageName: string) {
    const params = new HttpParams()
    .set('imageName', imageName)
    .set('id', id)
    return this.http.get(`${this.baseApi}/file-upload/single-public`, {
      params,
      responseType: 'blob',
      withCredentials: true
    });
  }


  async createUrl(image: Blob, images: any[]) {
    const reader = new FileReader();
    await reader.readAsDataURL(image);
    reader.onload = (event) => {
      const url = event.target?.result;
      images.push(url);
    }
  }
  

}
