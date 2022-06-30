import { UiService } from '../state/ui/ui.service';
import { ProfileService } from '../profile/profile.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UiQuery } from '../state/ui/ui.query';
import { UserService } from 'src/app/auth/state/user.service';
import { GlobalService } from 'src/app/state/global.service';
import { GlobalQuery } from 'src/app/state/global.query';
import { Snackbar } from 'src/app/__share/helper/snackbar';
import { LocalStorageData } from 'src/app/__share/helper/local-storage-data';
import { UploadService } from '../upload/state/upload/upload.service';
import { User } from 'src/app/auth/state/user.model';
import { FilesUpload } from 'src/app/__share/interface/files-upload.interface';
import { Upload } from '../upload/state/upload/upload.model';

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
  file    : Upload;
  upload  : boolean = false;

  @ViewChild('cameraParent') cameraParent: ElementRef;
  @ViewChild('imgProfile') imgProfile: ElementRef;

  
  constructor(
    private router: Router,
    private queryUi: UiQuery,
    private uiService: UiService,
    private userService: UserService,
    private globalService: GlobalService,
    private _snackbar: Snackbar,
    private localStorageData: LocalStorageData,
    private uploadService: UploadService,
    ) {}

  // @Hostl
  ngOnInit(): void {
    this.hasCookie();
    this.queryUi.getVisibilityUi().subscribe(isOpen => {      
      this.open = isOpen;
    });
  }
  
  toggleSidebar() {
    this.open = !this.open;
    this.uiService.updateUiSidebar(this.open);
  }

  listSelected(key: string) {
    this.item = key;
    // this.profileService.setShow(false);
  }


  logout() {
    this.userService.logout().subscribe(res => {
      if (res) {
        const result = JSON.parse(JSON.stringify(res));
        this.removeUser();
        this.globalService.update(result.loggedIn);

        this._snackbar.addSnackbar(result.message, result?.err, 3000);
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
      const id = this.file ? this.file._id : 0
      this.uploadService.uploadProfileImage(event.target.files[0], id).subscribe(
        res => {
          if (res && !res?.err) {
            this.file = res.file;
            this.upload = true;
          }
        }
      )
    }
  }


  getImageProfile() {
    this.uploadService.getImageProfile().subscribe(
      res => {        
        if (res && !res?.err) {
          this.file = res   
          this.upload = true;       
        }
      }
    )
  }

}