import { NgForm, FormGroup } from "@angular/forms";

export interface Form {
    formGroup: FormGroup;
    ngForm: NgForm;
}