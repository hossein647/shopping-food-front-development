import { Component, OnDestroy, OnInit } from '@angular/core';
import { SettingService } from './setting.service';
import { Setting } from 'src/app/___share/interface/setting.interface';
import { MatRadioChange } from '@angular/material/radio';
import { Snackbar } from 'src/app/___share/helper/snackbar';
import { UploadService } from '../upload/state/upload/upload.service';
import { Location } from '@angular/common';


@Component({
    selector: 'app-profile',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

    setting: Setting = { id: '', uploadCenter: ''};
    settingId: string;

    constructor(
        private settingService: SettingService,
        private uploadService: UploadService,
        private _sncakbar: Snackbar, 
        private location: Location,
    ) {}
    
    ngOnInit(): void {        
        this.getSetting();
    }


    getSetting() {
        this.uploadService.uploadCenter$.subscribe({
            next: (res: any) => {    
                if (res?.setting?.uploadCenter) {
                    this.settingId = res.setting.id;
                    this.setting.uploadCenter = res.setting.uploadCenter;
                }            
            },
            error: (err) => {}
        })
    }


    changeUploadCenter(radioItem: MatRadioChange) {
        this.settingService.updateSetting(this.settingId, radioItem.value).subscribe({
            next: (res: any) => {   
                console.log('changeUploadCenter : ', res.setting);
                
                if (res?.setting?.uploadCenter) {
                    this.settingId = res.setting.id;
                    this.setting.uploadCenter = res.setting.uploadCenter;
                    console.log('changeUploadCenter after : ', res);
                    window.location.reload()
                    this._sncakbar.addSnackbar('تنظیمات با موفقیت تغییر کرد', false, 3000)
                }                           
            },
            error: (err) => {
                this._sncakbar.addSnackbar('خطایی رخ داده است', true, 3000)
            }
        })
    }
}
