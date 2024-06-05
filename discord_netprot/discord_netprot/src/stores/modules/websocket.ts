// src/stores/websocket.ts
import { defineStore } from 'pinia';
import axios from 'axios';
import WebSocketService from '@/services/WebSocketService';
import { ref } from 'vue';

export const useWebSocketStore = defineStore('websocket', {
  state: () => ({
    connected: false,
    localStream: null as MediaStream | null,
    remoteStream: null as MediaStream | null,
    currentChannelId: null as string | null,
    currentSubscriptionId: null as string | null,
    username: '',  // Add username to the state
    userList: [] as string[],
    channelList: [] as { id: string, name: string }[],
    messageList: [] as { username: string, content: string }[],
    //video related
    videoOn: false,
    localVideoElement: null as HTMLVideoElement | null,
    remoteVideoElement: null as HTMLVideoElement | null,

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
        
        if(this.currentChannelId && this.remoteVideoElement){
          WebSocketService.joinVideoChannel(this.username, this.currentChannelId, this.localStream, this.remoteVideoElement);
        }
      } catch(error){
        console.error('Error starting call', error);
      }

    },
    handleDisconnectedUser(){
      WebSocketService.handleDisconnectedUser();
      if (this.remoteStream) {
        this.remoteStream.getTracks().forEach(track => track.stop());
        this.remoteStream = null;
        if(this.remoteVideoElement){
          this.remoteVideoElement.srcObject = null;
        }
      }
    },

    leaveVideoChannel(){
      WebSocketService.leaveVideoChannel_1();

      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;
        if(this.localVideoElement)
        this.localVideoElement.srcObject = null;
      }
      if (this.remoteStream) {
        this.remoteStream.getTracks().forEach(track => track.stop());
        this.remoteStream = null;
        if(this.remoteVideoElement)
        this.remoteVideoElement.srcObject = null;
      }

      if(this.currentChannelId){
        WebSocketService.leaveVideoChannel_2(this.username, this.currentChannelId);
      }
      this.videoOn = false;
    },

    handleCamera(){
      this.localStream?.getVideoTracks().forEach((track)=>{
        track.enabled = !track.enabled;
      })
    },

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
