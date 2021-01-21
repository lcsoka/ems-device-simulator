<template>
  <div class="flex flex-col-reverse sm:flex-row flex-grow">
    <div class="sm:w-7/12 p-2 h-full">
      <div class=" bg-gray-700 p-2 rounded h-full flex items-center justify-center">
        <div v-if="!waiting">
          <div v-if="!connected">Enter the device serial and press Start.</div>
          <div v-if="connected">TODO: Content here</div>
        </div>
        <div v-if="waiting">
          <div v-if="!connected">Waiting for connection...</div>
        </div>
      </div>
    </div>
    <div class="sm:w-5/12 p-2 flex-grow">
      <SideBar></SideBar>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue';
import SideBar from '@/components/SideBar.vue';
import { Socket } from 'electron-ipc-socket';
import { ipcRenderer } from 'electron';

@Component({
  components: {
    SideBar,
    HelloWorld,
  },
})
export default class Home extends Vue {
  socket = new Socket(ipcRenderer);

  waiting = false;

  connected = false;

  constructor() {
    super();
    this.socket.open('main-win');

    this.socket.onEvent('waiting-connection', () => {
      this.refreshStatus(true, false);
    });

    this.socket.onEvent('websocket-connect', () => {
      this.refreshStatus(false, true);
    });

    this.socket.onEvent('websocket-disconnect', () => {
      this.refreshStatus(false, false);
    });
  }

  refreshStatus(waiting: boolean, connected: boolean) {
    this.waiting = waiting;
    this.connected = connected;
  }
}
</script>
