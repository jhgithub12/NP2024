// src/types/webstomp-client.d.ts

declare module 'webstomp-client' {
    import { Client, Message, Subscription } from 'webstomp-client';
  
    export = Stomp;
  
    namespace Stomp {
      function over(socket: WebSocket): Client;
      function over(socket: SockJS): Client;
  
      interface Client {
        connect(
          headers: any,
          connectCallback: () => void,
          errorCallback?: (error: any) => void
        ): void;
        subscribe(
          destination: string,
          callback: (message: Message) => void
        ): Subscription;
        unsubscribe(id: string): void;
        send(
          destination: string,
          body: string,
          headers?: any
        ): void;
        connected: boolean;
      }
  
      interface Message {
        body: string;
      }
  
      interface Subscription {
        id: string;
      }
    }
  }
  