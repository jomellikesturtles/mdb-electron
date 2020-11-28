import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {


  constructor(
  ) {
    console.log('------------------WEBSOCKET SERVICE----------')
    // let socket = new WebSocket("wss://javascript.info/article/websocket/demo/hello");

    // socket.onopen = function (e) {

    //   alert("[open] Connection established");
    //   alert("Sending to server");
    //   socket.send("My name is John");
    // }
    // socket.onmessage = function (event) {
    //   alert(`[message] Data received from server: ${event.data}`);
    // };

    // socket.onclose = function (event) {
    //   if (event.wasClean) {
    //     alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    //   } else {
    //     // e.g. server process killed or network down
    //     // event.code is usually 1006 in this case
    //     alert('[close] Connection died');
    //   }
    // };

    // socket.onerror = function (error) {
    //   alert(`[error] ${error}`);
    // };
    let socket2 = new WebSocket("ws://localhost:8999");

    socket2.onopen = function (e) {
      alert("[open] Connection established");
      alert("Sending to server");
      socket2.send("connection");
    }
    socket2.onmessage = function (event) {
      alert(`[message] Data received from server: ${event.data}`);
      console.log('[message]: ', event.data);
    };

    socket2.onclose = function (event) {
      if (event.wasClean) {
        alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        alert('[close] Connection died');
      }
    };

    socket2.onerror = function (error) {
      console.log('[error]: ', error);
    };
  }

}
