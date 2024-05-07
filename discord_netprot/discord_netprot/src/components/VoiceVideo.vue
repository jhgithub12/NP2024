<script setup lang="ts">
import { ref, onMounted, watch, markRaw } from 'vue'
import { useChannelStore } from '@/stores/channelStore';
import VideoBox from './VideoBox.vue';

const msg = ref('');
// Watch for changes in the message stored in ChannelStore
watch(() => useChannelStore().msg, (newValue) => {
    msg.value = newValue;
});

const endCall = () => {
    console.log('Ending call');
    // Add logic to end the call
};

onMounted(() => {
    // Assign the messages container reference when the component is mounted
    msg.value = useChannelStore().msg;
});

// Maintain a list of video components
const videoComponents = ref<(typeof VideoBox)[]>([]); // Specify the type of the array

// Track the currently selected video box
const selectedVideoBox = ref<typeof VideoBox | null>(null);

// Function to add a video box component
const addVideoBox = () => {
    console.log('Adding video box');
    if (videoComponents.value.length < 6) {
        videoComponents.value.push(markRaw(VideoBox));
    }
};

// Function to select a video box
const selectVideoBox = (index: number) => {
    selectedVideoBox.value = videoComponents.value[index];
};

</script>

<template>
    <div class = "full-area">
        <div class = "top-bar">
            <img alt="number sign" class="logo" src="@/assets/speaker_icon.svg" width="15" height="15" />
            <p class = "channel-name">{{ msg }}</p>
        </div>
        <div class = "division-bar"></div>
        <div class = "video-area">
            <div class = "video-box-large-video">
                <component class = "video-large" :is="selectedVideoBox" v-if="selectedVideoBox" />
            </div>
            <div class = "video-box">
                <component class ="video" :is="videoComponent" v-for="(videoComponent, index) in videoComponents" :key="index" @click="selectVideoBox(index)"/>
            </div>
        </div>
        <div class = "buttons-area">
            <button class ="hangup-button" @click="addVideoBox">
                <img alt="end call" class="end-call" src="@/assets/end_call.svg"/>
            </button>
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
.video-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #313338;
    align-items: center;
    justify-content: center;
}
.video-box-large-video {
    width: 100%;
    flex: 1;
    display: flex;
    background-color: #313338;
    align-items: center;
    justify-content: center;

}
.video-box {
    width: 100%;
    height: 150px;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: row;
}
.video-large {
    display: block;
    max-width:1600px;
    max-height:1200px;
    width: auto;
    height: auto;
    width: 800px;
    height: 600px;
    background-color: black;
    margin: 10px;
    border-radius: 10px 10px;
    cursor: pointer;

}
.video{
    width: 160px;
    height: 120px;
    background-color: black;
    margin: 10px;
    border-radius: 10px 10px;
    cursor: pointer;
}
.buttons-area {
    width: 100%;
    height: 90px;
    background-color: #313338;
    display: flex;
    justify-content: center; /* center horizontally */
    align-items: center; /* center vertically */
}
.hangup-button {
    width: 49px;
    height: 49px;
    padding: 0; /* Remove padding */
    margin: 0; /* Remove margin */
    background-color: white;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
}

.end-call {
    width: 51px;
    height: 51px;
}
.end-call:hover {
    background-color: #404249;
    border-radius: 50%;
}

</style>