import { Reserve } from "src/app/front/main-content/circular-slide-show/interfaces/reserve.interface";
import { SuperFood } from "src/app/___share/enum/super-food.enum";

export interface Food {
  _id?: number;
  id: number;
  userId: number;
  imageId: number;
  shop: string;
  name: string;
  description: string;
  category: string;
  subFood: string;
  image: string;
  copon: number;
  price: number;
  super: boolean;
  state: SuperFood;
  reserved: Reserve;
  rating: {userId: number, rate: number}[];
  average: number;
  length: number;
  descriptionConfirm?: string;
}
