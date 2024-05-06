<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useChannelStore } from '@/stores/channelStore';


const msg = ref('');
// Watch for changes in the message stored in ChannelStore
watch(() => useChannelStore().msg, (newValue) => {
  msg.value = newValue;
});

// Define a ref to store the typed messages
const typedMessages = ref<string[]>([])
// Define a ref to store the current message being typed
const currentMessage = ref<string>('')
// Define a ref to store the messages container reference
const messagesRef = ref<HTMLDivElement | null>(null);

// Function to handle sending a message
const sendMessage = () => {
    if (currentMessage.value.trim() !== '') {
        typedMessages.value.push(currentMessage.value)
        currentMessage.value = ''
        setTimeout(() => {
            scrollToBottom();
        }, 50);
    }
}
// Function to scroll to the bottom of the messages
const scrollToBottom = () => {
    if (messagesRef.value) {
        messagesRef.value.scrollTo({
            top: messagesRef.value.scrollHeight,
            behavior: 'smooth'
        });
    }
};

onMounted(() => {
    // Assign the messages container reference when the component is mounted
    msg.value = useChannelStore().msg;
    messagesRef.value = document.querySelector('.messages');
    scrollToBottom();
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
                <div v-for="(message, index) in typedMessages" :key="index" class="message">{{ message }}</div>
            </div>
        </div>
        <div class = "input-area">
            <!-- Bind currentMessage to the input field -->
            <input v-model="currentMessage" @keyup.enter="sendMessage" class="message-bar" type="text" placeholder=" Type Message Here" />
        </div>
    </div>

</template>

<style scoped>
.full-area {
    width: 100%;
    height: 100%;
    background-color: blueviolet;
    display: flex;
    flex-direction: column;
}
.top-bar {
    user-select: none; 
    width: 100%;
    height: 32px;
    background-color: #313338;
    display: flex;
    align-items: center;
    justify-content: left;
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
    max-width: 100%;
    max-height: 86vh;
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