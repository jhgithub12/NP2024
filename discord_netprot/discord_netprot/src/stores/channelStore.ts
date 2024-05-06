// channelStore.ts
import { defineStore } from 'pinia';

export const useChannelStore = defineStore('channel', {
  state: () => ({
    msg: '',
  }),
  actions: {
    setMsg(msg: string) {
      this.msg = msg;
    },
  },
});
