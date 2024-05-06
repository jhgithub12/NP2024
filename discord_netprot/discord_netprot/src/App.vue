<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import CurrentlyOnline from './components/CurrentlyOnline.vue'
import ChannelsAvailable from './components/ChannelsAvailable.vue';

import { defineComponent } from 'vue';
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
          <div class = "username">Arthur Okonkwo</div>
        </div>
      </div>
      <div class = "router-container">
        <RouterView class = "router-view"/>
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
  flex: 1;
}
.router-view {
  flex: 1;
  display: flex
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