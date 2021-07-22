import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'htmlCodes' })
export class HtmlCodesPipe implements PipeTransform {
    transform(value: string): string {
        value = value.split("&#039;").join("'")
        value = value.split("&quot;").join('"')
        return value
    }
}