import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
    private dataSource = new BehaviorSubject<any>({});

    sendDataSource(data: {}) {
        this.dataSource.next(data);
    }

    clearDataSource(): any {
        this.dataSource.next({});
    }

    getDataSource(): Observable<any> {
        return this.dataSource.asObservable();
    }
}