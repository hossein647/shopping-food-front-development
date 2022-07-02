import { Injectable } from "@angular/core";
import { GlobalService } from "src/app/state/global.service";


@Injectable({
    providedIn: 'root'
})
export class LocalStorageData {

    constructor(
        private globalService: GlobalService,
    ) {}

    set(key: string, value: string) {
        window.localStorage.setItem(key, value);
    }

    get(key: string) {
        return window.localStorage.getItem(key);
    }

    remove(key: string) {
        localStorage.removeItem(key);
    }

    setLoginExpire(key: string, expire: number, loggedIn: boolean, id: number, email: string, role: string) {
        if (this.get('elsfu')) this.remove('elsfu');
        const data = { id, email, role, loggedIn, expire }
        this.set(key, JSON.stringify(data));
    }

    checkUserExpire(key: string) {
        let result: any = false;
        const data = JSON.parse(JSON.parse(JSON.stringify(this.get(key))));        
        if (data) {
            const now = new Date().getTime();            
            if (now > data.expire) {
                this.remove(key);
                
                this.globalService.update({ loggedIn: false });
            }
            else {
                result = data;
                this.globalService.update({ loggedIn: true });
            }
        }
        return result;
    }

}