<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { io } from 'socket.io-client';
import router from '@/router';
import { useChannelStore } from '@/stores/channelStore';

const socket = io('http://localhost:8080', {
  transports: ['websocket']
});


const msg = ref('');
// Watch for changes in the message stored in ChannelStore
watch(() => useChannelStore().msg, (newValue) => {
  msg.value = newValue;
  // Re-subscribe to the new channel when it changes
  socket.emit('joinChannel', useChannelStore().msg);
});

interface Message {
    text: string;
    senderName: string;
    profilePictureUrl: string;
}

// Define a ref to store the typed messages
const typedMessages = ref<Message[]>([]);
// Define a ref to store the current message being typed
const currentMessage = ref<string>('')
// Define a ref to store the messages container reference
const messagesRef = ref<HTMLDivElement | null>(null);
    const currentUser = ref<{ name: string; profilePictureUrl: string }>({
    name: 'John Doe', // Example user name
    profilePictureUrl: 'path/to/profile/picture.jpg' // Example profile picture URL
});

// Function to handle sending a message
const sendMessage = () => {
  if (currentMessage.value.trim() !== '') {
    const message = {
      text: currentMessage.value,
      senderName: currentUser.value.name,
      profilePictureUrl: currentUser.value.profilePictureUrl
    };
    socket.emit('sendMessage', {
      channel: useChannelStore().msg,
      message
    });
    currentMessage.value = '';
    setTimeout(() => {
      scrollToBottom();
    }, 50);
  }
};

// Function to scroll to the bottom of the messages
const scrollToBottom = () => {
    if (messagesRef.value) {
        messagesRef.value.scrollTo({
            top: messagesRef.value.scrollHeight,
            behavior: 'smooth'
        });
    }
};

socket.on('receiveMessage', (message: Message) => {
  typedMessages.value.push(message);
  setTimeout(() => {
    scrollToBottom();
  }, 50);
});

onMounted(() => {
    // Assign the messages container reference when the component is mounted
    msg.value = useChannelStore().msg;
    messagesRef.value = document.querySelector('.messages');
    socket.emit('joinChannel', useChannelStore().msg);
    scrollToBottom();
});

onUnmounted(() => {
  socket.disconnect();
});
</script>



<template>
    <div class = "full-area">
        <div class = "top-bar">
            <img alt="number sign" class="logo" src="@/assets/number_sign.svg" width="15" height="15" />
            <p class = "channel-name">{{ msg }}</p>
        </div>
        <div class = "division-bar"></div>
        <div class = "text-area">
            <div class="messages">
                <!-- Loop through typedMessages and display each message -->
                <div v-for="(message, index) in typedMessages" :key="index" class="message">
                    <img :src="message.profilePictureUrl" alt="Profile Picture" class="profile-picture" />
                    <div class="message-content">
                        <p class="sender-name">{{ message.senderName }}</p>
                        <p>{{ message.text }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class = "input-area">
            <!-- Bind currentMessage to the input field -->
            <input v-model="currentMessage" @keyup.enter="sendMessage" class="message-bar" type="text" placeholder=" Type Message Here" />
        </div>
    </div>

</template>

<style scoped>
.message {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
}

.profile-picture {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
}

.message-content {
    background-color: #383A40;
    padding: 10px;
    border-radius: 5px;
    max-width: 80%;
}

.sender-name {
    font-weight: bold;
    margin-bottom: 5px;
    color: #E6E7EA;
}
/*Old*/

.full-area {
    width: 100%;
    height: 100%;
    background-color: blueviolet;
    display: flex;
    flex-direction: column;
}
.top-bar {
    border-top-left-radius: 15px;
    user-select: none; 
    width: 100%;
    height: 32px;
    background-color: #313338;
    display: flex;
    align-items: center;
    justify-content: left;
}
.topbar-filler{
    flex: 1;
}
.text-chat-button{
    width: 5%;
    height: 90%;
    color: #1E1F22;
    background-color: #B5BAC1;
    border: none;
    border-radius: 15px;
    cursor: pointer;
    padding: 10px;
    text-align: center;
    font-weight: bold;
    text-justify: center;
}
.text-chat-button:hover{
    background-color: #DBDEE1;
}
.logo{ 
    margin-left: 10px;
}
.channel-name {
    margin-left: 5px;
    color: #F2F3F5;
    font-weight: bold;
}
.division-bar {
    width: 100%;
    height: 3px;
    background-color: #35363C;
}
.text-area {
    width: 100%;
    flex: 1;
    display: flex;
    background-color: #313338;
}
.input-area {
    border-bottom-left-radius: 15px;
    width: 100%;
    height: 60px;
    background-color: #313338;
    display: flex;
    justify-content: center; /* center horizontally */
    align-items: center; /* center vertically */
}
.message-bar {
    background-color: #383A40;
    color: #E6E7EA;
    font-size: 175%;
    max-width: 100%;
    border: none;
    width: 95%;
    margin-bottom: auto;
    border-radius: 10px 10px;
}
.messages {
    width: 100%;
    max-width:  80vw;
    max-height: 80vh;
    overflow-y: auto; /* Enable vertical scrolling */
    padding: 20px; /* Add padding to prevent messages from touching the edges */
    word-wrap: break-word;
    
}
.message {
    color: #E6E7EA;
    white-space: pre-wrap;
}

/* Hide the default scrollbar */
::-webkit-scrollbar {
    width: 10px; /* Set the width of the scrollbar */
}

/* Track (the area behind the thumb) */
::-webkit-scrollbar-track {
    background: #2B2D31; /* Color of the track */
    border-radius: 5px 5px;
}

/* Handle (the draggable part of the scrollbar) */
::-webkit-scrollbar-thumb {
    background: #1A1B1E; /* Color of the thumb */
    border-radius: 5px 5px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #1A1B1E; /* Color of the thumb on hover */
}


</style>