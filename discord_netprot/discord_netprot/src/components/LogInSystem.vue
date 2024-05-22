<script lang="ts">
export default {
  props: {
    // Declare the showModal prop
    show: Boolean
  },
  data() {
    return {
      // Remove unnecessary data property
      userName: '' as string,
      //channelType: 0 as number,
    }
  },
  computed: {
    isCreateDisabled() {
      return this.userName.trim() === ''; // Disable button if channel name is empty
    }
  },
  methods: {
    joinServer() {
        // Emit an event to pass channel data to the parent component
        this.$emit('joinServer', this.userName)// type: this.channelType })
        this.userName = "";
        //this.channelType = 0;
    }
  }
}
</script>


<template>
    <!-- Use showModal prop to control visibility -->
    <div v-if="show" class="modal-area">
        <img alt="background image" class="background-image" src="@/assets/background.svg"  />
        <div class ="modal-box" :class="{ 'show': show }" @click.stop>
            <div class = "header">
                <h1>Join Server</h1>
            </div>
            
            <!-- Input field for channel name -->
            <div class ="input-field">
                <h2>USER NAME</h2>
                <input class ="user-name" type="text" v-model="userName" placeholder=" enter username here" />
            </div>
            <div class ="create-close">
                <!-- Login Button -->
                <button class ="login-button" @click="joinServer" :disabled="isCreateDisabled">LOGIN</button>
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
    background-color: rgba(64, 78, 287, 1); /* semi-transparent black background */
    display: flex;
    justify-content: center; /* center horizontally */
    align-items: center; /* center vertically */
}
.background-image{
    position: fixed;
    width: 80%;
    height: 80%;
    bottom: 0;
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
.user-name {
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
    justify-content: center; /* center horizontally */
    align-items: center; /* center vertically */
    flex: 1;
}
.login-button {
    width: 60%;
    height: 45px;
    background-color: #5865F2;
    border: none;
    color: #E6E7EA;
    font-size: 90%;
    max-width: 100%;
    font-weight: bold;
    margin-right: 15px;
    cursor: pointer;
    border-radius: 5px 5px;
}
.login-button[disabled] {
    width: 60%;
    height: 45px;
    background-color: #414991;
    border: none;
    color: #7F8196;
    font-size: 90%;
    max-width: 100%;
    font-weight: bold;
    margin-right: 15px;
    cursor: pointer;
    border-radius: 5px 5px;
}
.login-button[disabled]:hover {
    cursor: not-allowed;
}
.login-button:not([disabled]):hover {
    background-color: #4752C4;
}

</style>