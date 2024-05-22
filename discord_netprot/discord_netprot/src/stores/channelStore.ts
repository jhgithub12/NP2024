// channelStore.ts
import { defineStore } from 'pinia';

export const useChannelStore = defineStore('channel', {
  state: () => ({
    msg: '',
    myUserName: '',
  }),
  actions: {
    setMsg(msg: string) {
      this.msg = msg;
    },
    setUsrNm(myUserName: string) {
      this.myUserName = myUserName;
    }
  },
});
