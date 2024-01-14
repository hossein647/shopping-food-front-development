export interface Upload {
  id: string;
  userId: number;
  originalname: string;
  filename: string;
  url: string;
  statusCode: string;
  message: string;
  setting: {
    id: string;
    uploadCenter: string;
  }
  fileLiara?: {
    Location: string,
    Key: string,
    Bucket: string
  },
}