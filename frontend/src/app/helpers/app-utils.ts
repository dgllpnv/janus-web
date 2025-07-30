import { FormArray, FormGroup } from "@angular/forms";

export default class AppUtils {
    
  public static findInvalidControlsRecursive(formToInvestigate:FormGroup|FormArray) {
    let recursiveFunc = (form:FormGroup|FormArray) => {
      Object.keys(form.controls).forEach(field => { 
        const control = form.get(field);
        if (control?.invalid) {
          console.log(control.errors);
          control.markAsTouched();
        }

        if (control instanceof FormGroup) {
          recursiveFunc(control);
        } else if (control instanceof FormArray) {
          recursiveFunc(control);
        }        
      });
    }
    recursiveFunc(formToInvestigate);
  }
}