import { Food } from "src/app/__dashboard/foods/state/food.model";

export interface GlobalFront {
    [key: string]: Food[];
}