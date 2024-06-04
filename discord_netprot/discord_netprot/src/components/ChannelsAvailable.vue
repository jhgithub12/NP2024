<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import CreateChannel from './CreateChannel.vue';
import { useChannelStore } from '@/stores/channelStore';
import { useWebSocketStore } from '@/stores/modules/websocket';
import axios from 'axios';

const showModal = ref(false)
const showContextMenu = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })
const selectedChannel = ref<Channel | null>(null)

interface Channel {
  id: number;
  name: string;
}

const channels = ref<Channel[]>([]);

const fetchChannels = async () => {
  try {
    const response = await axios.get('http://localhost:8080/channels');
    channels.value = response.data.map((channel: { channelId: number, channelName: string }) => ({
      id: channel.channelId, // Corrected key access
      name: channel.channelName, // Corrected key access
    }));
  } catch (error) {
    console.error('Failed to fetch channels:', error);
  }
};


const joinChannel = (channel: Channel) => {
  console.log('Joining channel:', channel.name);
  useChannelStore().setMsg(channel.name);
  useWebSocketStore().subscribeToChannel(channel.id.toString());
};

const createChannel = (channelData: { name: string, id:number }) => {
  // Logic to create the channel using the provided data
  const newChannel: Channel = {id: channels.value.length + 1, name: channelData.name};
  //channels.value.push(newChannel);
  console.log('Creating channel:', channelData)
  showModal.value = false // Close the modal after channel creation
}

const closeModal = () => {
  showModal.value = false
}

const openContextMenu = (event: MouseEvent, channel: Channel) => {
  event.preventDefault();
  selectedChannel.value = channel;
  showContextMenu.value = true;
  contextMenuPosition.value = { x: event.clientX, y: event.clientY };
}

const deleteChannel = async () => {
  if (selectedChannel.value) {
    const channelId = selectedChannel.value.id;
    try {
      await axios.delete(`http://localhost:8080/channels/${channelId}`);
      channels.value = channels.value.filter(channel => channel.id !== channelId);
      console.log(`Deleted channel with ID: ${channelId}`);
    } catch (error) {
      console.error(`Failed to delete channel with ID: ${channelId}`, error);
    }
    selectedChannel.value = null;
    showContextMenu.value = false;
  }
};

const closeContextMenu = () => {
  showContextMenu.value = false;
  selectedChannel.value = null;
}

let intervalId: number | null = null;

onMounted(() => {
  intervalId = setInterval(fetchChannels, 1000); // Check every second
  document.addEventListener('click', closeContextMenu);
});

onUnmounted(() => {
  document.removeEventListener('click', closeContextMenu);
});

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
          <button 
            class = "select-channel" 
            v-for="channel in channels" 
            :key="channel.id" 
            @click="joinChannel(channel)"
            @contextmenu="openContextMenu($event, channel)"
            >
            <img alt="number sign" class="logo" src="@/assets/number_sign.svg" width="12" height="12" />
              {{ channel.name }}
          </button>
        </div>
        <CreateChannel :show="showModal" @createChannel="createChannel" @closeModal="closeModal"/>
        <div v-if="showContextMenu" class="context-menu" :style="{ top: `${contextMenuPosition.y}px`, left: `${contextMenuPosition.x}px` }">
          <button @click="deleteChannel">Delete Channel</button>
        </div>
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
.context-menu {
  position: absolute;
  background-color: #DA373C;
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
}
.context-menu button {
  padding: 10px;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  width: 100%;
}
.context-menu button:hover {
  background-color: #a12828;
  border: none;
  border-radius: 10px;
}
</style>