// src/services/WebSocketService.ts
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import Peer from 'simple-peer';

class WebSocketService {
  private stompClient: Stomp.Client | null = null;
  private peers: Peer.Instance[] = [];
  private localStream: MediaStream | null = null;
  private remoteStreams: MediaStream[] = [];

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

  async setVideoStream(localVideoElement: HTMLVideoElement): Promise<MediaStream | null> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoElement.srcObject = stream;
      this.localStream = stream;
      return stream;
    } catch (error) {
      console.error('Error accessing media devices.', error);
      return null;
    }
  }

  joinVideoChannel(currentChannelId: string, username: string, localVideoElement: HTMLVideoElement, remoteVideoElements: HTMLVideoElement[]) {
    this.setVideoStream(localVideoElement).then(() => {
      if (this.stompClient && currentChannelId) {
        const videoSubscription = this.stompClient.subscribe('/topic/channels/' + currentChannelId + '/video', res => {
          const receivedUsername = JSON.parse(res.body).username;
          if (username !== receivedUsername) {
            this.sendOffer(receivedUsername, remoteVideoElements);
          }
        });

        const offerSubscription = this.stompClient.subscribe('/topic/offer/' + username, res => {
          const response = JSON.parse(res.body);
          this.sendAnswer(response.sender, remoteVideoElements);
          this.handleSignal(response.signal);
        });

        const answerSubscription = this.stompClient.subscribe('/topic/answer/' + username, res => {
          const response = JSON.parse(res.body);
          this.handleSignal(response.signal);
        });

        this.stompClient.send("/app/channels/" + currentChannelId + '/video/entrance', JSON.stringify({ username }), {});
      }
    });
  }
  private sendOffer(username: string, remoteVideoElements: HTMLVideoElement[]) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: this.localStream || undefined
    });

    peer.on('signal', (data) => {
      if (this.stompClient) {
        this.stompClient.send('/app/offer', JSON.stringify({
          sender: username,
          receiver: username,
          signal: data
        }));
      }
    });

    peer.on('stream', (stream) => {
      const availableVideoElement = remoteVideoElements.find(videoElement => !videoElement.srcObject);
      if (availableVideoElement) {
        availableVideoElement.srcObject = stream;
        this.remoteStreams.push(stream);
      }
    });

    peer.on('error', (err) => {
      console.error('Error with peer connection:', err);
    });

    this.peers.push(peer);
  }

  private sendAnswer(username: string, remoteVideoElements: HTMLVideoElement[]) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: this.localStream || undefined
    });

    peer.on('signal', (data) => {
      if (this.stompClient) {
        this.stompClient.send('/app/answer', JSON.stringify({
          sender: username,
          receiver: username,
          signal: data
        }));
      }
    });

    peer.on('stream', (stream) => {
      const availableVideoElement = remoteVideoElements.find(videoElement => !videoElement.srcObject);
      if (availableVideoElement) {
        availableVideoElement.srcObject = stream;
        this.remoteStreams.push(stream);
      }
    });

    peer.on('error', (err) => {
      console.error('Error with peer connection:', err);
    });

    this.peers.push(peer);
  }

  private handleSignal(signalData: any) {
    this.peers.forEach(peer => {
      if (peer) {
        peer.signal(signalData);
      }
    });
  }

}

export default new WebSocketService();
