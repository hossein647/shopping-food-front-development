
export interface User {
  _id?: number;
  id?: number;
  email: string;
  password: string;
  role: Role;
  image?: string;
}

// export function createUser(params: Partial<User>) {
//   return {

//   } as User;
// }


export enum Role {
  Admin = 'admin',
  Seller = 'seller',
  Customer = 'customer',
}