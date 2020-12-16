import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({ name: 'jsonFilterBy' })
@Injectable()
export class JsonFilterByPipe implements PipeTransform {

    transform(json: any[], args: any[]): any[] {
        const searchText = args[0];
        const jsonKey = args[1];
        const jsonKeyArray = [];

        if (searchText == null || searchText === 'undefined') { return json; }
        if (jsonKey.indexOf(',') > 0) {
            jsonKey.split(',').forEach((key) => {
                jsonKeyArray.push(key.trim());


            });
        } else {
            jsonKeyArray.push(jsonKey.trim());
        }

        if (jsonKeyArray.length === 0) { return json; }

        // Start with new Array and push found objects onto it.
        const returnObjects = [];
        // console.log('filterObjectEntry',filterObjectEntry);


        json.forEach((filterObjectEntry) => {

            jsonKeyArray.forEach((jsonKeyValue) => {
                if (typeof filterObjectEntry[jsonKeyValue] !== 'undefined' &&
                    filterObjectEntry[jsonKeyValue].toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
                    // object value contains the user provided text.
                    returnObjects.push(filterObjectEntry);
                }
            });
        });
        return returnObjects;
    }
}
