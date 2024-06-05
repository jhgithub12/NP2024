<script setup lang="ts">
import { ref, onMounted} from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import CurrentlyOnline from './components/CurrentlyOnline.vue'
import ChannelsAvailable from './components/ChannelsAvailable.vue';
import VoiceVideo from './components/VoiceVideo.vue';
import TextChatting from './components/TextChatting.vue';
import LogInSystem from './components/LogInSystem.vue';
import axios from 'axios';

import { defineComponent } from 'vue';

const showModal = ref(true)
const userName = ref('')

const joinServer =( name: string )=>{
  userName.value = name;
  showModal.value = false // Close the modal after server join
}

const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:8080/users');
    users.value = response.data.map((userlist: { id: number, username: string }) => ({
      name: userlist.username, // Corrected key access
      id: userlist.id,
    }));
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
};

interface dpInfo{
    id: number;
    src: string;
    alt: string;
}

const images = ref<dpInfo[]>([
  { id: 1, src: '/src/assets/sample/dp1.png', alt: 'Description of image 1' },
  { id: 2, src: '/src/assets/sample/dp2.png', alt: 'Description of image 2' },
  { id: 3, src: '/src/assets/sample/dp3.png', alt: 'Description of image 3' },
  { id: 4, src: '/src/assets/sample/dp4.png', alt: 'Description of image 4' },
  { id: 5, src: '/src/assets/sample/dp5.png', alt: 'Description of image 5' },
  { id: 6, src: '/src/assets/sample/dp6.png', alt: 'Description of image 6' },
  // Add more images as needed
]);

interface userInfo{
    id: number;
    name: string;
    dp: number;
}
const users = ref<userInfo[]>([]);

const getImageSource = () => {
  // Iterate over the users array to find the user with the matching userName
  for (const user of users.value) {
    if (user.name === userName.value) {
      // Find the image that matches the user's dp id
      const image = images.value.find(img => img.id === user.id);
      return image ? image.src : '';
    }
  }
  return ''; // Return an empty string or a default value if no match is found
};

const getImageSrc = () => {
  // Find the user object where the name matches userName.value
  const user = users.value.find(user => user.name === userName.value);
  
  // Check if user is found and then find the image with the matching id
  if (user) {
    const image = images.value.find(img => img.id === user.dp);
    return image ? image.src : '';
  }
  
  // If user is not found or image is not found, return an empty string or a default image
  return '';
};

let intervalId: number | null = null;
onMounted(() => {
    intervalId = setInterval(fetchUsers, 1000); // Check every second
});

</script>

<template>
  <div class = "app-area">
    <LogInSystem :show="showModal" @joinServer="joinServer"/>
    <div class = "top-bar">
      <header>
        <h1>Discord</h1>
      </header>
    </div>
    <div class = "content-container">
      <div class = "server-users">
        <CurrentlyOnline/>
        <ChannelsAvailable/>
        <div class = "bottom-bar">
          <!-- USER INFORMATION (사용자 정보)-->
          <img alt="Profile picture" class="dp" :src="getImageSource()" />
          <div class = "username">{{ userName }}</div>
        </div>
      </div>
      <div class = "router-container">
        <!--<RouterView class = "router-view"/>-->
        <VoiceVideo class = "voicevideo-area"/>
        <div class = "filler-area"></div>
        <TextChatting class = "text-area"/>
      </div>
    </div>
  </div>
  
</template>

<style scoped>
.app-area {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.top-bar {
  user-select: none; 
  width: 100%;
  height: 40px;
  background-color: #1E1F22;
  display: flex;
  align-items: center;
}
.content-container {
  flex: 1;
  display: flex;
  flex-direction: row;
}
.server-users {
  width: 250px;
  display: flex;
  flex-direction: column;
}
.router-container {
  display: flex;
  flex-direction: row;
  flex: 1;
}
.router-view {
  flex: 1;
  display: flex;
}
.voicevideo-area{
  width: 69.5%;
}
.filler-area{
  width: .5%;
  background-color: #1E1F22;
}
.text-area{
  width: 30%;
  background-color: #1E1F22;
}
.bottom-bar {
  user-select: none; 
  width: 250px;
  height: 60px;
  background-color: #1E1F22;
  color: #949BA4;
  display: flex;
  align-items: center;
  justify-content: left;
}
header {
  color: #949BA4;
  font-size: 15px;
  text-align: left;
  flex: 1;
}
h1 {
  margin-left: 10px;
}
.dp {
  margin-left: 15px;
  width: 40px; /* Adjust the width as needed */
  height: 40px; /* Adjust the height as needed */
  border-radius: 50%; /* Create a circular border */
}
.username {
  margin-left: 10px;
  color: white;
}
</style>