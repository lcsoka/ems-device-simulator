<template>
  <div class="flex flex-col flex-grow h-full">
    <div class="bg-gray-700 p-2 rounded mb-4">
      <div>
        <label for="serial" class="block text-sm font-medium text-gray-300">Serial number</label>
        <div class="mt-1 relative rounded-md shadow-sm">
          <input type="text" name="serial" id="serial"
                 class="bg-gray-600 focus:ring-green-500 focus:border-green-500 block w-full pl-2
               pr-2 sm:text-sm border-gray-600 rounded-md mb-2"
                 placeholder="abc123"
                 v-bind:value="serial"
                 v-on:input="serial = $event.target.value"/>
        </div>
      </div>
      <div>
        <div class="w-full inline-flex rounded-md shadow">
          <button class="w-full inline-flex items-center justify-center px-2 py-2 border
         border-transparent text-base font-medium rounded-md text-white
         bg-green-500 hover:bg-green-600 disabled:opacity-50" v-on:click="start()"
                  :disabled="!canConnect">
            Start
          </button>
        </div>
      </div>
    </div>
    <div class="bg-gray-700 p-2 rounded flex-grow flex flex-col">

      <label for="serial" class="block text-sm font-medium text-gray-300">Log</label>
      <div class="mt-1 relative rounded-md shadow-sm flex-grow">
          <textarea name="log" id="log" disabled
                    class="bg-gray-600  block w-full pl-2 focus:ring-gray-600 focus:border-gray-600
               pr-2 sm:text-sm border-gray-600 rounded-md mb-2 h-full"
                    v-bind:value="log"></textarea>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ipcRenderer } from 'electron';
import { Socket } from 'electron-ipc-socket';
import Simulator from '@/ems/simulator';

@Component
export default class SideBar extends Vue {
  serial = ''

  log = ''

  canConnect = true;

  socket = new Socket(ipcRenderer);

  constructor() {
    super();

    this.socket.open('main-win');

    this.socket.onEvent('websocket-message', (event) => {
      Simulator.getInstance().print(event.data, this.addLog);
    });

    this.socket.onEvent('websocket-disconnect', (event) => {
      this.enableButton();
    });
  }

  enableButton() {
    this.canConnect = true;
  }

  start() {
    // Simulator.getInstance().print(this.addLog);
    // ipcRenderer.send('start-device', this.serial);
    this.socket.send('start-device', this.serial);
    this.canConnect = false;
  }

  addLog(content: string) {
    this.log = content;
  }
}
</script>

<style scoped>
textarea {
  resize: none;
  font-size: 14px;
}
</style>
