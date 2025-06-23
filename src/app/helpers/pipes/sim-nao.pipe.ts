import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'simNao'
})
export class SimNaoPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return value ? "Sim" : "Não";
  }

}
