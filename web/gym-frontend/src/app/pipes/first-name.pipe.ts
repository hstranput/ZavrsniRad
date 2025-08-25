import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstName',
  standalone: true 
})
// izvlaci samo ime kako bi bilo pregledenijee prikazano u headeru
export class FirstNamePipe implements PipeTransform { 

  transform(value: string | undefined | null): string {
    
    if (!value) {
      return '';
    }
    
    return value.split(' ')[0];
  }
}