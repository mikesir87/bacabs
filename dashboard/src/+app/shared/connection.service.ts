import { Injectable } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { isBrowser } from 'angular2-universal';

import { ReconnectingWebSocket } from './ReconnectingWebsocket';


@Injectable()
export class ConnectionService {

    private connectionObservable : Observable<Boolean>;
    private connectionObserver : Observer<Boolean>;
    private webSocket : ReconnectingWebSocket;

    constructor() {
        if (isBrowser) {
            const protocol = (window.location.protocol == 'https') ? 'wss' : 'ws';
            const url = `${protocol}://${window.location.host}/events`;
            this.webSocket = new ReconnectingWebSocket(url);
            this.webSocket.onopen = this.onOpen.bind(this);
            this.webSocket.onclose = this.onClose.bind(this);
            this.webSocket.onmessage = this.onMessage.bind(this);
        }
        this.connectionObservable = Observable.create((observer) => this.connectionObserver = observer);
    }

    isConnected() : Observable<Boolean> {
this.connectionObservable.subscribe((value) => console.log("Notified of change", value));

        return this.connectionObservable;
    }

    private onOpen() {
        console.log("WebSocket connection opened");
        this.connectionObserver.next(true);
    }

    private onClose() {
        console.log("WebSocket connection closed");
        this.connectionObserver.next(false);
    }

    private onMessage(messageData : MessageEvent) {
        console.log("Message received", messageData.data);
    }
}
