// src/services/WebSocketService.ts
import Peer from 'simple-peer';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';

class WebSocketService {
  private stompClient: Stomp.Client | null = null;

  connect(username: string, onConnect: () => void, onError: (error: any) => void) {
    const serverURL = 'http://localhost:8080/ws';
    const socket = new SockJS(serverURL);
    this.stompClient = Stomp.over(socket);

    const headers = {
      username,
      'accept-version': '1.1,1.2',
      'heart-beat': '10000,10000',
    };

    this.stompClient.connect(headers, onConnect, onError);
  }

  subscribe(destination: string, callback: (message: Stomp.Message) => void): Stomp.Subscription | null {
    if (this.stompClient) {
      return this.stompClient.subscribe(destination, callback);
    }
    return null;
  }

  unsubscribe(subscriptionId: string) {
    if (this.stompClient) {
      this.stompClient.unsubscribe(subscriptionId);
    }
  }

  send(destination: string, body: any) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send(destination, JSON.stringify(body), {});
    }
  }

  isConnected(): boolean {
    return this.stompClient ? this.stompClient.connected : false;
  }
}

export default new WebSocketService();
