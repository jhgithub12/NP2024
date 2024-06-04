<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useWebSocketStore } from '@/stores/modules/websocket';
import axios from 'axios';

const isEmpty = ref(false);

const store = useWebSocketStore();
const userList = store.userList;


interface dpInfo{
    id: number;
    src: string;
    alt: string;
}

const images = ref<dpInfo[]>([
  { id: 1, src: '/src/assets/sample/sample_dp.png', alt: 'Description of image 1' },
  // Add more images as needed
]);

const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:8080/users');
    users.value = response.data.map((userlist: { username: string }) => ({
      name: userlist.username, // Corrected key access
    }));
  } catch (error) {
    console.error('Failed to fetch channels:', error);
  }
};


interface userInfo{
    id: number;
    name: string;
    dp: number;
}
const users = ref<userInfo[]>([
  //{ id: 1, name: 'Jeho', dp: 1 },
  //{ id: 2, name: 'Boyeon', dp: 1},
  //List of users that are online
  //To be retrieved from the server
]);

const checkIfUsersArrayIsEmpty = () => {
  isEmpty.value = users.value.length === 0;
  console.log('Checking if users array is empty:', isEmpty.value);
};


let intervalId: number | null = null;

onMounted(() => {
    intervalId = setInterval(fetchUsers, 1000); // Check every second
    intervalId = setInterval(checkIfUsersArrayIsEmpty, 1000); // Check every second
});

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }
});

// Watch the users array and log when it changes
watch(users, (newUsers) => {
  console.log('Users array updated:', newUsers);
});

// Function to get the image source based on user dp id
const getImageSrc = (dpId: number) => {
  const image = images.value.find(img => img.id === dpId);
  return image ? image.src : '';
};
</script>

<template>
    <div class = "display-area">
        <header>            
            <div class = "profile-pictures">
                <div class = "header">
                    <img alt="Vue logo" class="logo" src="@/assets/online.svg" width="25" height="25" />
                    <h2>Users Online</h2>
                </div>
            </div>
        </header>
        <div class = "division-bar"></div>
        <div class = "user-list">
            <h1 v-if="isEmpty">There are no users online</h1>
            <p 
                class ="users" 
                v-for="user in users" 
                :key="user.id">
                <!-- <img :src="getImageSrc(user.dp)" alt="Profile Picture" class="profile-picture" />-->
                <img :src="getImageSrc(1)" alt="Profile Picture" class="profile-picture" />
                <!--{{ user.name }}-->
                {{ user.name }}
            </p>
        </div>
    </div>

</template>

<style scoped>

.display-area {
    width: 100%;
    height:50%;
    background-color: #2B2D31;
    display: flex;
    flex-direction: column;
}
.division-bar {
    width: 100%;
    height: 3px;
    background-color: #35363C;
}
.user-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.users{
    user-select: none; 
    width: 100%;
    padding: 10px;
    background-color: transparent;
    color: #949BA4;
    border: none;
    text-align: left;
    font-weight: bold;
    text-justify: center;
}
.profile-picture{
    width: 30px;
    height: 30px;
    border-radius: 10px;
}
h1 {
    text-align: center;
    padding-top:40px;
    color: #949BA4;
}
h2 {
    margin-left: 10px;
    color: #949BA4;
}
.header {
    user-select: none; 
    display: flex;
    align-items: center; /* Align items vertically */
}
.logo {
    margin-left: 10px;
}
</style>