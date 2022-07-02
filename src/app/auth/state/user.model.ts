
export interface User {
  _id?: number;
  id?: number;
  email: string;
  password: string;
  role: Role;
  image?: string;
}




export enum Role {
  Admin = 'admin',
  Seller = 'seller',
  Customer = 'customer',
}