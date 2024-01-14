import { UiService } from '../state/ui/ui.service';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UiQuery } from '../state/ui/ui.query';
import { UserService } from 'src/app/auth/state/user.service';
import { GlobalService } from 'src/app/state/global.service';
import { Snackbar } from 'src/app/___share/helper/snackbar';
import { LocalStorageData } from 'src/app/___share/helper/local-storage-data';
import { UploadService } from '../upload/state/upload/upload.service';
import { Upload } from '../upload/state/upload/upload.model';
import { environment } from 'src/environments/environment';
import { GlobalFrontService } from 'src/app/front/_services/global-front.service';
import { first, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  open    : boolean = false;
  item    : string = '';
  email   : string;
  expire  : any;
  loggedIn: boolean;
  role    : string;
  file    : Upload = { filename: '', id: '', originalname: '', setting: {id: '', uploadCenter: ''}, url: '', statusCode: '', userId: 0, message: '' };
  baseApi : string = environment.url;
  keyImage: string = '';
  uploadCenter: string = '';

  @ViewChild('cameraParent') cameraParent: ElementRef;
  @ViewChild('imgProfile')   imgProfile  : ElementRef;

  
  constructor(
    private router            : Router,
    private queryUi           : UiQuery,
    private _snackbar         : Snackbar,
    private uiService         : UiService,
    private userService       : UserService,
    private globalService     : GlobalService,
    private uploadService     : UploadService,
    private localStorageData  : LocalStorageData,
    private globalFrontService: GlobalFrontService,
    ) {
      this.globalService.uploadCenter$.subscribe({
        next: (res: any) => {
          if (res?.setting?.uploadCenter) {
            this.uploadCenter = res.setting.uploadCenter;
          }
        }
      })
    }


  ngOnInit(): void {
    if (!this.uploadCenter) {
      this.globalService.getSetting().subscribe({
        next: (res: any) => {
          if (res?.setting?.uploadCenter) {
            this.uploadCenter = res.setting.uploadCenter;
          }
        }
      })
    }
    this.hasCookie();
    this.queryUi.getVisibilityUi().subscribe(isOpen => {      
      this.open = isOpen;
    });
    this.closeSidebar();
    this.item = this.selectedListByCurrentRoute(this.router.url);    
  }
  
  toggleSidebar() {
    this.open = !this.open;
    this.uiService.updateUiSidebar(this.open);
  }

  listSelected(key: string) {
    this.item = key;
  }


  logout() {
    this.userService.logout().subscribe(res => {
      if (res) {
        const result = JSON.parse(JSON.stringify(res));
        
        this.globalService.update(result.loggedIn);

        this._snackbar.addSnackbar(result.message, result?.err, 3000);

        const email = this.globalFrontService.getEmail();
        if (email) {
          const orderListUser = JSON.parse(window.localStorage.getItem(`orderFood_${email}`) || '[]')
          const arrayOrderList = Object.keys(orderListUser);
          const isEmptyOrderList = arrayOrderList.length === 0;
          
          if (!isEmptyOrderList) {
            this.globalFrontService.updateOrderFood(orderListUser);
            window.localStorage.setItem(`orderFood_guest`, JSON.stringify(orderListUser));
          }
          window.localStorage.removeItem(`orderFood_${email}`);
        }
        this.removeUser();
        if (!result?.err) this.router.navigate(['/']);
      }
    })
  }

  checkUserExpire() {
    this.expire = this.localStorageData.checkUserExpire('elsfu');
    this.email = this.expire?.email;
    this.role = this.expire?.role;        
  }

  removeUser() {
    this.expire = this.localStorageData.remove('elsfu')
  }

  hasCookie() {
    this.userService.hasCookie().subscribe(res => {
      if (res) {        
        const result = JSON.parse(JSON.stringify(res));
        this.loggedIn = result.loggedIn;
        this.globalService.update(result.loggedIn);
        this.checkUserExpire();
        this.getImageProfile();
        if (this.loggedIn === false) this.router.navigate(['/']);
      }
    })
  }


  changeFileSelect(event: any) {
    if (event.target.files.length > 0) {   
      this.uploadService.uploadCenter$.subscribe({
        next: (resSetting) => {
          const repairImageName = this.removeSpaceChar(event.target.files[0].name)
          
          const file = new File([event.target.files[0]], repairImageName, { type: event.target.files[0].type })
            const oldDataImage = {
              id:       this.file.id,
              filename: this.file.filename || '',
              setting:  resSetting.setting,
            }  
          this.uploadService.uploadProfileImage(file, oldDataImage).subscribe(
            res => {                        
              if (res?.setting?.uploadCenter === 'host') {
                if (res) {            
                  this.file = res;
                    this.file.url = this.baseApi + '/' + this.file.url;
                } else {
                  const tooLarge = 'سایز تصویر بیش از یک مگابایت می باشد.';            
                  if (res.error.statusCode === 413) this._snackbar.addSnackbar(tooLarge, true, 3000)
                }
            } else if (res?.setting?.uploadCenter === 'liara') {
              this.file = res;
              }
            }
          )
        },
        error: (err) => {}
      })
    }
  }


  async getImageProfile() {    
    const key = this.keyImage;
    this.uploadService.getImageProfile(key).subscribe({
      next: (res: any) => {        
        this.file = res;        
        if (res?.setting?.uploadCenter === 'host' && res.statusCode === 200) this.file.url = this.baseApi + '/' + res.url;        
      },
      error: (err) => {}
    })
  }


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.closeSidebar(event)
  }


  closeSidebar(event?: any) {   
    const screenWidth = event?.target.innerWidth || window.innerWidth;     
    if ((screenWidth) <= 992) this.uiService.updateUiSidebar(false);
    else this.uiService.updateUiSidebar(true);
  }


  selectedListByCurrentRoute(url: string): string {    
    return  url.includes('create')    ? url.slice(13, -7) 
            : url.includes('edit')    ? url.slice(13, -30)
            : url.includes('/upload') ? url.slice(13, -7)
            : url.slice(13)
  }


  removeSpaceChar(str: string) {
    const arr: string[] = str.split('');
    return (arr.map((char, index) => char == ' ' ? char = '_' : char)).join('')
  }
}
