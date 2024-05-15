<script lang="ts">
import { ref } from 'vue'

export default {
  props: {
    // Declare the showModal prop
    show: Boolean
  },
  data() {
    return {
      // Remove unnecessary data property
      channelName: '' as string,
      channelType: 0 as number,
    }
  },
  computed: {
    isCreateDisabled() {
      return this.channelName.trim() === ''; // Disable button if channel name is empty
    }
  },
  methods: {
    createChannel() {
        // Emit an event to pass channel data to the parent component
        this.$emit('createChannel', { name: this.channelName, type: this.channelType })
        this.channelName = "";
        this.channelType = 0;
    },
    closeModal() {
        this.channelName = "";
        this.channelType = 0;
        // Emit an event to close the modal
        this.$emit('closeModal')
    },
    selectType(type: number) {
        // Function to select the channel type
        this.channelType = type;
    }
  }
}
</script>

<template>
    <!-- Use showModal prop to control visibility -->
    <div v-if="show" class="modal-area" @click="closeModal">
        <div class ="modal-box" :class="{ 'show': show }" @click.stop>
            <div class = "header">
                <h1>Create Channel</h1>
            </div>
            
            <!-- Input field for channel name -->
            <div class ="input-field">
                <h2>CHANNEL NAME</h2>
                <input class ="channel-name" type="text" v-model="channelName" placeholder="# new-channel" />
            </div>
            <div class ="create-close">
                <!-- Buttons to confirm or cancel channel creation -->
                <button class ="cancel-button" @click="closeModal">Cancel</button>
                <button class ="create-button" @click="createChannel" :disabled="isCreateDisabled">Create Channel</button>
            </div>
        </div>
    </div>
</template>
  
<style scoped>
/* Styles for the modal */
.modal-area {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* semi-transparent black background */
    display: flex;
    justify-content: center; /* center horizontally */
    align-items: center; /* center vertically */
}
.modal-box {
    width: 300px;
    min-height: 150px;
    border-radius: 25px;
    background-color: #313338;
    padding: 20px;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease-out;
    transform-origin: center;
    transform: scale(0);
}
.show {
    transform: scale(1);
}
.header {
    width: 100%;
    height: 10%;
    background-color: transparent;
}
h1 {
    color: #E6E7EA;
    font-size: 150%;
    max-width: 100%;
    text-align: center;
}
.type-selection {
    flex: 1;
    display: flex;
    flex-direction: column;
}
.type-button {
    width: 100%;
    padding: 10px;
    margin-bottom: 0px;
    background-color: #2B2D31;
    color: #E6E7EA;
    font-size: 100%;
    max-width: 100%;
    border: none;
    cursor: pointer;
    text-align: left;
    display: flex;
    flex-direction: row;
}
.type-button:not(.selected):hover {
    background-color: #393C41;
}
.selected {
    background-color: #43444B;
}
.input-field {
    width: 100%;
    justify-content: center; /* center horizontally */
    align-items: center; /* center vertically */
    flex: 1;
}
h2 {
    color: #E6E7EA;
    padding-top: 15px;
    font-size: 80%;
    max-width: 100%;
    text-align: left;
    padding-bottom: 5px;
}
.channel-name {
    background-color: #1E1F22;
    color: #E6E7EA;
    font-size: 120%;
    max-width: 100%;
    border: none;
    width: 100%;
}

.create-close{
    height: 30%;
    width: 100%;
    display: flex;
    justify-content: flex-end; /* center horizontally */
    align-items: center; /* center vertically */
    flex: 1;
}

.logo {
    margin-left: auto; /* Stick to the right */
    margin-right: 5px; /* Add a bit of margin */
    width: 20px; /* Set width */
    height: 20px; /* Set height */
}
.cancel-button {
    background-color: transparent;
    border: none;
    color: #E6E7EA;
    font-size: 80%;
    max-width: 100%;
    font-weight: bold;
    margin-right: 15px;
    cursor: pointer;
    text-decoration: none;
}
.create-button {
    width: 40%;
    height: 30px;
    background-color: #5865F2;
    border: none;
    color: #E6E7EA;
    font-size: 80%;
    max-width: 100%;
    font-weight: bold;
    margin-right: 15px;
    cursor: pointer;
    border-radius: 5px 5px;
}
.create-button[disabled] {
    width: 40%;
    height: 30px;
    background-color: #414991;
    border: none;
    color: #7F8196;
    font-size: 80%;
    max-width: 100%;
    font-weight: bold;
    margin-right: 15px;
    cursor: pointer;
    border-radius: 5px 5px;
}
.cancel-button:hover {
    text-decoration: underline;
}
.create-button[disabled]:hover {
    cursor: not-allowed;
}
.create-button:not([disabled]):hover {
    background-color: #4752C4;
}
</style>
  