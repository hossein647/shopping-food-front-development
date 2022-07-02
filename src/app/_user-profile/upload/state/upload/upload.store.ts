import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Upload } from './upload.model';

export interface UploadState extends EntityState<Upload> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'upload' })
export class UploadStore extends EntityStore<UploadState> {

  constructor() {
    super();
  }
}
