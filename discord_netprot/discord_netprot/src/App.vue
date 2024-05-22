<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import CurrentlyOnline from './components/CurrentlyOnline.vue'
import ChannelsAvailable from './components/ChannelsAvailable.vue';
import VoiceVideo from './components/VoiceVideo.vue';
import TextChatting from './components/TextChatting.vue';
import LogInSystem from './components/LogInSystem.vue';

import { defineComponent } from 'vue';


const showModal = ref(true)
const userName = ref('')

const joinServer =( name: string )=>{
  userName.value = name;
  showModal.value = false // Close the modal after server join
}

</script>

<template>
  <!--
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
  -->
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
          <img alt="Profile picture" class="dp" src="@/assets/sample/sample_dp.png" />
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