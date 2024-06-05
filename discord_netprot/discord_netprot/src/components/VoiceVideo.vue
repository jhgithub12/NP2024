<script setup lang="ts">
import { ref, onMounted, watch, markRaw, type ComponentPublicInstance } from 'vue'
import { useChannelStore } from '@/stores/channelStore';
import { useWebSocketStore } from '@/stores/modules/websocket';


const joinedCall = ref(false)
const joinedVideo = ref(false)
const joinedChannel = ref(false)

const msg = ref('');
// Watch for changes in the message stored in ChannelStore
watch(() => useChannelStore().msg, (newValue) => {
    msg.value = newValue;
});

const localVideoElement = ref<HTMLVideoElement | null>(null);
const remoteVideoElements = ref<HTMLVideoElement[]>([]);

const startCall = () => {
    joinedCall.value = true;
    console.log('Starting call');
    useWebSocketStore().joinVideoChannel();
};
const endCall = () => {
    joinedCall.value = false;
    joinedVideo.value = false;
    console.log('Ending call');
    //end video channel?????
};
const startVideo = () => {
    joinedVideo.value = true;
    console.log('Starting video');
};
const endVideo = () => {
    joinedVideo.value = false;
    console.log('Ending video');
    // Add logic to end video sharing
};

const confirmJoinedChannel= () =>{
    if (useWebSocketStore().currentChannelId){
        joinedChannel.value = true;
    }
    else{
        joinedChannel.value = false;
    }
}

let intervalId: number | null = null;

onMounted(() => {
    intervalId = setInterval(confirmJoinedChannel, 100); // Check every second
    // Assign the messages container reference when the component is mounted
    msg.value = useChannelStore().msg;

    // Initialize local video element
    if (!localVideoElement.value) {
        localVideoElement.value = document.createElement('video');
    }

    // Set the video elements in the WebSocket store
    useWebSocketStore().localVideoElement = localVideoElement.value;
    useWebSocketStore().remoteVideoElement = remoteVideoElements.value;

});

//모든 video elements에 대한 배열
const videoComponents = ref<HTMLVideoElement[]>([]);

//현재 선택된 (가장 크게 나올) video element
const selectedVideoBox = ref<HTMLVideoElement | null>(null);

//영상 선택 함수
const selectVideoBox = (index: number) => {
    selectedVideoBox.value = videoComponents.value[index];
}


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
            </div>
            <div class="video-box">
                <!--<video class = "video" :ref= "videoComponent" v-for = "(videoComponent, index) in videoComponents" :key = "index" @click = "selectVideoBox(index)" autoplay></video>-->
                <video class = "video" ref ="localVideoElement" autoplay></video>
            </div>
        </div>
        <div class = "buttons-area">
            <div v-if="joinedCall">
                <button class ="hangup-button" @click="endCall">
                    <img alt="end call" class="end-call" src="@/assets/end_call.svg"/>
                </button>
            </div>
            <div v-else-if="!joinedCall && joinedChannel">
                <button class ="hangup-button" @click="startCall">
                    <img alt="end call" class="end-call" src="@/assets/start_call.svg"/>
                </button>
            </div>
            <div v-if="joinedVideo && joinedCall">
                <button class ="hangup-button" @click="endVideo">
                    <img alt="end call" class="end-call" src="@/assets/end_video.svg"/>
                </button>
            </div>
            <div v-else-if="!joinedVideo && joinedCall">
                <button class ="hangup-button" @click="startVideo">
                    <img alt="end call" class="end-call" src="@/assets/start_video.svg"/>
                </button>
            </div>
        </div>
    </div>

</template>

<style scoped>
.full-area {
    width: 100%;
    height: 100%;
    background-color: #1E1F22;
    display: flex;
    flex-direction: column;
}
.top-bar {
    border-top-right-radius: 15px;
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
    border-bottom-right-radius: 15px;
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
    margin-right: 15px;
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