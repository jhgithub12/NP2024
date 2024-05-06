<script setup lang="ts">
import { ref } from 'vue'
const usersOnline = ref(false)
const selfConnected = ref(false)
setTimeout(() => {
  usersOnline.value = true // Simulate users coming online after a delay
}, 3000)
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
            <h1 v-if="!usersOnline">There are no users online</h1>
            <h1 v-else>List of users online (to do)</h1>
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