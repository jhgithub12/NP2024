// src/stores/websocket.ts
import { defineStore } from 'pinia';
import axios from 'axios';
import WebSocketService from '@/services/WebSocketService';
import { ref } from 'vue';

export const useWebSocketStore = defineStore('websocket', {
  state: () => ({
    connected: false,
    localStream: null as MediaStream | null,
    remoteStreams: [] as MediaStream[], // Changed to array
    currentChannelId: null as string | null,
    currentSubscriptionId: null as string | null,
    username: '',  // Add username to the state
    userList: [] as string[],
    channelList: [] as { id: string, name: string }[],
    messageList: [] as { username: string, content: string }[],
    //video related
    videoOn: false,
    localVideoElement: document.createElement('video'),
    remoteVideoElements: Array.from({ length: 5 }, () => document.createElement('video')), // Initialize with 5 video elements

  }),
  actions: {
    async joinVideoChannel(){
      this.videoOn = true;
      try{
        this.localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        this.localStream.getVideoTracks().forEach((track) => {
          track.enabled = false;
        });
        if(this.localVideoElement){
          this.localVideoElement.srcObject = this.localStream;
        }
        
        if(this.currentChannelId && this.remoteVideoElements.length > 0){
          WebSocketService.joinVideoChannel(this.username, this.currentChannelId, this.localStream, this.remoteVideoElements);
        }
      } catch(error){
        console.error('Error starting call', error);
      }

    },
    handleDisconnectedUser() {
      WebSocketService.handleDisconnectedUser();
      this.remoteStreams.forEach(stream => {
        stream.getTracks().forEach(track => track.stop());
      });
      this.remoteStreams = [];
      this.remoteVideoElements.forEach(videoElement => {
        videoElement.srcObject = null;
      });
      this.remoteVideoElements = [];
    },

    leaveVideoChannel() {
      WebSocketService.leaveVideoChannel_1();

      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;
        if (this.localVideoElement)
          this.localVideoElement.srcObject = null;
      }

      this.remoteStreams.forEach(stream => {
        stream.getTracks().forEach(track => track.stop());
      });
      this.remoteStreams = [];
      this.remoteVideoElements.forEach(videoElement => {
        videoElement.srcObject = null;
      });
      this.remoteVideoElements = [];

      if (this.currentChannelId) {
        WebSocketService.leaveVideoChannel_2(this.username, this.currentChannelId);
      }
      this.videoOn = false;
    },

    handleCamera(){
      this.localStream?.getVideoTracks().forEach((track)=>{
        track.enabled = !track.enabled;
      })
    },

    //여기까지가 영상/음성 부분

    setUsername(username: string) {  // Add an action to set the username
      this.username = username;
    },
    connect() {
      WebSocketService.connect(this.username, () => {
        this.connected = true;
        this.refreshUsers();
        this.refreshChannels();

        WebSocketService.subscribe("/topic/users", (res) => {
          const message = JSON.parse(res.body);
          if (message.eventType === "CONNECT") {
            this.userList.push(message.username);
          } else {
            this.userList = this.userList.filter(username => username !== message.username);
          }
        });
      }, (error) => {
        console.error("STOMP error:", error);
        this.connected = false;
      });
    },
    subscribeToChannel(channelId: string) {
      if (this.currentChannelId && this.currentSubscriptionId) {
        WebSocketService.unsubscribe(this.currentSubscriptionId);
        this.messageList = [];
      }

      const subscription = WebSocketService.subscribe(`/topic/channels/${channelId}/text`, res => {
        const message = JSON.parse(res.body);
        this.messageList.push(message);
      });

      if (subscription) {
        this.currentChannelId = channelId;
        this.currentSubscriptionId = subscription.id;
      } else {
        console.error('Failed to subscribe to channel');
      }
    },
    sendMessage(content: string) {
      if (WebSocketService.isConnected()) {
        const msg = { username: this.username, content: content };
        WebSocketService.send(`/app/channels/${this.currentChannelId}/text/messages`, msg);
      }
    },
    refreshUsers() {
      axios.get('http://localhost:8080/users')
        .then(response => {
          this.userList = response.data
            .filter((user: { username: string }) => user.username !== this.username)
            .map((user: { username: string }) => user.username);
        })
        .catch(() => {
          console.error('Failed to load user list');
        });
    },
    refreshChannels() {
      axios.get('http://localhost:8080/channels')
        .then(response => {
          this.channelList = response.data;
        })
        .catch(() => {
          console.error('Failed to load channel list');
        });
    },
  }
});
