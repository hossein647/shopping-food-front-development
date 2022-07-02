import { Food } from "src/app/_user-profile/foods/state/food.model";

export interface GlobalFront {
    [key: string]: Food[];
}