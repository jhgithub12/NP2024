<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router';
import CreateChannel from './CreateChannel.vue';
import { useChannelStore } from '@/stores/channelStore';

const showModal = ref(false)

interface Channel {
  id: number;
  name: string;
  type: number; //0 for text only, 1 for voice + video
}

const channels = ref<Channel[]>([
  { id: 1, name: 'General', type: 0 },
  { id: 2, name: 'Music' , type: 1},
  // Add more channels as needed
]);

const joinChannel = (channel: Channel) => {
  console.log('Joining channel:', channel.name);
  if (channel.type == 0){
    useChannelStore().setMsg(channel.name);
    router.push('/text');
  }
  else if (channel.type == 1){
    useChannelStore().setMsg(channel.name);
    router.push('/voicevideo');
  }
  
};

const createChannel = (channelData: { name: string, type: number }) => {
  // Logic to create the channel using the provided data
  const newChannel: Channel = {id: channels.value.length + 1, name: channelData.name, type: channelData.type};
;  channels.value.push(newChannel);
  console.log('Creating channel:', channelData)
  showModal.value = false // Close the modal after channel creation
}

const closeModal = () => {
  showModal.value = false
}

</script>



<template>
    <div class = "channels-container">
        <div class = "division-bar"></div>
        <div class = "header">
            <img alt="Channel icon" class="logo" src="@/assets/channel_icon.svg" width="50" height="50" />
            <h1>Channels</h1>
            <button class="create-channel" @click="showModal = true">
              <img alt="Plus button" class="logo" src="@/assets/plus_sign.svg" width="30" height="30" />
            </button>
        </div>
        <div class = "division-bar"></div>
        <div class = "channel-buttons">
          <button class = "select-channel" v-for="channel in channels" :key="channel.id" @click="joinChannel(channel)">
            <img v-if="channel.type === 0"alt="number sign" class="logo" src="@/assets/number_sign.svg" width="12" height="12" />
            <img v-else alt="speaker icon" class="logo" src="@/assets/speaker_icon.svg" width="12" height="12" />
              {{ channel.name }}
          </button>
        </div>
        <CreateChannel :show="showModal" @createChannel="createChannel" @closeModal="closeModal"/>
    </div>
</template>


<style scoped>
.channels-container {
    flex: 1;
    width: 100%;
    height: 50%;
    display: flex;
    flex-direction: column;
    background-color: #2B2D31;
}
.header {
    user-select: none; 
    display: flex;
    align-items: center;
}
h1 {
    font-size: 25;
    text-align: left;
    color: #949BA4;
}
.division-bar {
    width: 100%;
    height: 3px;
    background-color: #35363C;
}
.channel-buttons {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.create-channel {
    width: 100%;
    padding: 5px;
    margin-bottom: 0px;
    background-color: transparent;
    border: none;
    cursor: pointer;
}
.select-channel {
    width: 100%;
    padding: 10px;
    margin-bottom: 0px;
    background-color: transparent;
    color: #949BA4;
    border: none;
    cursor: pointer;
    text-align: left;
}
.select-channel:hover, .create-channel:hover {
  background-color: #404249;
  border-radius: 5px;
  width: 100%;
}
</style>