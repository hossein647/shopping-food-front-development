export interface Upload {
  _id: number;
  userId: number;
  originalname: string;
  filename: string;
  destination: string;
  path: string;
  url: string;
}