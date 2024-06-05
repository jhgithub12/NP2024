// src/services/WebSocketService.ts
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import type { Message } from 'webstomp-client';

class WebSocketService {
  private stompClient: Stomp.Client | null = null;
  private videoChannelSubscribeId: string | null = null;
  private offerSubscribeId: string | null = null;
  private answerSubscribeId: string | null = null;
  private candidateSubscribeId: string | null = null;
  private peerConnection: RTCPeerConnection | null = null;
  private peername: string | null = null;



  connect(username: string, onConnect: () => void, onError: (error: any) => void) {
    const serverURL = 'http://localhost:8080/ws';
    const socket = new SockJS(serverURL);
    this.stompClient = Stomp.over(socket);

    const headers = {
      'username': username,
      'accept-version': '1.0,1.1,1.2', // Ensuring all versions are accepted
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

  //video methods

  joinVideoChannel(username: string, currentChannelId: string, localStream: MediaStream, remoteVideo: HTMLVideoElement){
    if(this.stompClient){
      const videoChannelSubscribe = this.stompClient.subscribe('/topic/channels/' + currentChannelId +'/video', (message) => this.handleRequest(message, username));
      const offerSubscribe = this.stompClient.subscribe('/topic/offer/' + username, (message) => this.handleOffer(message, username));
      const answerSubscribe = this.stompClient.subscribe('/topic/answer/' + username, this.handleAnswer);
      const candidateSubscribe = this.stompClient.subscribe('/topic/candidate/' + username, this.handleCandidate);
      this.videoChannelSubscribeId = videoChannelSubscribe.id;
      this.offerSubscribeId = offerSubscribe.id;
      this.answerSubscribeId = answerSubscribe.id;
      this.candidateSubscribeId = candidateSubscribe.id;
    }

    this.peerConnection = new RTCPeerConnection();
    localStream.getTracks().forEach(track => this.peerConnection?.addTrack(track, localStream));
    
    this.peerConnection.onicecandidate = event =>{
      if (event.candidate){
        this.stompClient?.send('/app/candidate', JSON.stringify({
          sender: username,
          receiver: this.peername,
          candidate: event.candidate
        }), {});
      }
    }

    this.peerConnection.ontrack = event => {
      if (remoteVideo.srcObject !== event.streams[0]){
        remoteVideo.srcObject = event.streams[0];
      }
    };

    this.stompClient?.send('/app/channels/' + currentChannelId + '/video/conn', JSON.stringify({
      username: username,
      eventType: 'CONNECT'
    }), {});
  }
  
  async handleRequest(message: Message, username: string){
    const peername = JSON.parse(message.body).username;
    this.peername = peername;
    if(peername!== this.peername){
      if(JSON.parse(message.body).eventType === "CONNECT"){
        const offer = await this.peerConnection?.createOffer();
        this.peerConnection?.setLocalDescription(offer);
        this.stompClient?.send('/app/offer', JSON.stringify({
          sender: username,
          receiver: peername,
          signal: offer
        }), {});
      }
      else{
        this.peername = null;
      }
    }
  }

  async handleOffer(message: Message, username: string) {
    const offer = JSON.parse(message.body).signal;
    this.peername = JSON.parse(message.body).sender;
    this.peerConnection?.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.peerConnection?.createAnswer();
    this.peerConnection?.setLocalDescription(answer);
    this.stompClient?.send('/app/answer', JSON.stringify({
      sender: username,
      receiver: JSON.parse(message.body).sender,
      signal: answer
    }), {});
  }
  async handleAnswer(message: Message) {
    const answer = JSON.parse(message.body).signal;
    this.peerConnection?.setRemoteDescription(new RTCSessionDescription(answer));
  }
  async handleCandidate(message: Message) {
    const candidate = JSON.parse(message.body).candidate;
    await this.peerConnection?.addIceCandidate(new RTCIceCandidate(candidate));
  }
  handleDisconnectedUser() {
    this.peername = null;

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
  }
  leaveVideoChannel_1(){
    this.peername = null;

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
  }
  leaveVideoChannel_2(username: string, currentChannelId: string){
    if(this.stompClient && this.videoChannelSubscribeId && this.offerSubscribeId && this.answerSubscribeId && this.candidateSubscribeId){
      this.stompClient.unsubscribe(this.videoChannelSubscribeId);
      this.stompClient.unsubscribe(this.offerSubscribeId);
      this.stompClient.unsubscribe(this.answerSubscribeId);
      this.stompClient.unsubscribe(this.candidateSubscribeId);

      this.stompClient.send('/app/channels/' + currentChannelId + '/video/conn', JSON.stringify({
          username: username,
          eventType: 'DISCONNECT'
        }), {});
    }
  }

}

export default new WebSocketService();
