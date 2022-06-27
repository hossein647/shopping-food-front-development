import { FormGroup, NgForm } from "@angular/forms";

export interface FormStepper {
    formGroups: FormGroup[];
    ngForms: NgForm[];
}