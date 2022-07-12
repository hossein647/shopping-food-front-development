export interface Upload {
  _id: number;
  userId: number;
  originalname: string;
  filename: string;
  destination: string;
  path: string;
  url: string;
}

// export function createUpload(params: Partial<Upload>) {
  //   return {
    
    //   } as Upload;
    // }
    
    // export interface Upload {
    //   name: string;
    //   size: number;
    //   length: number;
    //   lastModified: number;
    //   lastModifiedData: Date;
    //   type: string;  
    // }