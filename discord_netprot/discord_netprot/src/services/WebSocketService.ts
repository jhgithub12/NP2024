// src/services/WebSocketService.ts
import Stomp, { Client, type Subscription } from 'webstomp-client';
import SockJS from 'sockjs-client';

class WebSocketService {
  private stompClient: Client | null = null;
  private connected = false;

  connect(username: string, onConnect: () => void, onError: () => void) {
    const serverURL = 'http://localhost:8080/ws';
    const socket = new SockJS(serverURL);
    this.stompClient = Stomp.over(socket);

    const headers = { username };

    this.stompClient.connect(headers, () => {
      this.connected = true;
      onConnect();
    }, () => {
      this.connected = false;
      onError();
    });
  }

  subscribe(destination: string, callback: (message: any) => void): Subscription | null {
    if (this.stompClient && this.connected) {
      return this.stompClient.subscribe(destination, res => {
        callback(JSON.parse(res.body));
      });
    }
    return null;
  }

  unsubscribe(subscriptionId: string) {
    this.stompClient?.unsubscribe(subscriptionId);
  }

  send(destination: string, body: any) {
    if (this.stompClient && this.connected) {
      this.stompClient.send(destination, JSON.stringify(body), {});
    }
  }

  isConnected() {
    return this.connected;
  }
}

export default new WebSocketService();
