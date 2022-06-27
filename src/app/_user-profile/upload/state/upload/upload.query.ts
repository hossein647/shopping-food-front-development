import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { UploadStore, UploadState } from './upload.store';

@Injectable({ providedIn: 'root' })
export class UploadQuery extends QueryEntity<UploadState> {
  selectImage$ = this.select();
  constructor(protected store: UploadStore) {
    super(store);
  }

}
