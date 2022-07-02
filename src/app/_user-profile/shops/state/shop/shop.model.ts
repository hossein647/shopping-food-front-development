export interface Shop {
  _id: number;
  name: string;
  description: string[];
  category: string;
  address: string;
  phone: string;
  image: string;
  imageId: number;
  userId: number;
}

// export function createShop(params: Partial<Shop>) {
//   return {

//   } as Shop;
// }
