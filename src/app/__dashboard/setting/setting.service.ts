import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, of, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { UploadService } from "../upload/state/upload/upload.service";


@Injectable({ providedIn: 'root' })
export class SettingService {

    baseApi = environment.url;
    // private changeUploadCenter = new BehaviorSubject<string>('');
    // changeUploadCenter$ = this.changeUploadCenter.asObservable();

    constructor(
        private http: HttpClient,
        private uploadService: UploadService,
    ) {}


    updateSetting(_id: string, uploadCenter: string) {
        return this.http.post(`${this.baseApi}/setting/update`, { _id, uploadCenter }, { withCredentials: true })
        .pipe(
            tap((res: any) => {
                console.log('setSetting res : ', res);
                
                this.uploadService.setUploadCenter(res.setting);
                return res;
            }),
            catchError((err) => throwError(() => of(err)))
        )
    }
}