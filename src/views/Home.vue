<template>
  <div class="flex flex-col-reverse sm:flex-row flex-grow">
    <div class="sm:w-7/12 p-2 h-full">
      <div class=" bg-gray-700  rounded h-full overflow-y-auto">
        <div v-if="!waiting" class="h-full">
          <div v-if="!connected" class="h-full flex items-center justify-center">
            Enter the device serial and press Start.
          </div>
          <div v-if="connected" class="h-full">
            <div class="p-2">
              <div class="bg-gray-600 p2 rounded flex">
                <div class="w-3/12 p-2">💪 {{ deviceValues.master }}%</div>
                <div class="w-3/12 p-2">🕛 {{ deviceValues.time }}s</div>
                <div class="w-3/12 p-2">⏸ {{ deviceValues.pause }}s</div>
                <div class="w-3/12 p-2">🔋 {{ deviceValues.battery }}%</div>
              </div>
            </div>
            <div class="channels flex flex-wrap">
              <div class="p-2 w-1/2 " v-for="channel in deviceValues.channels" :key="channel.id">
                <div class="bg-gray-600 rounded ">
                  <div class="px-2 py-1 bg-gray-500 rounded border-b border-gray-500">
                  <span class="font-bold uppercase text-sm">{{ channel.name }}</span>
                  </div>
                  <div class="p-2 border-b border-gray-500">
                    <div class="flex justify-between">
                      <div class="name text-xs">Strength</div>
                      <div class="value text-xs">{{ channel.value }}%</div>
                    </div>
                    <div class="relative pt-1">
                      <div class="overflow-hidden h-1 text-xs flex rounded bg-green-200">
                        <div v-bind:style="{width:channel.value+'%'}"
                            class="transition-all duration-500 shadow-none flex flex-col text-center
                              whitespace-nowrap text-white justify-center bg-green-500"></div>
                      </div>
                    </div>
                  </div>
                  <div class="p-2">
                    <div class="flex justify-between">
                      <div class="name text-xs">Freq</div>
                      <div class="value text-xs">{{ channel.freq }}%</div>
                    </div>
                    <div class="relative pt-1">
                      <div class="overflow-hidden h-1 text-xs flex rounded bg-green-200">
                        <div v-bind:style="{width:channel.freq+'%'}"
                            class="transition-all duration-500 shadow-none flex flex-col text-center
                              whitespace-nowrap text-white justify-center bg-green-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="waiting" class="h-full flex items-center justify-center">
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
import SideBar from '@/components/SideBar.vue';
import { Socket } from 'electron-ipc-socket';
import { ipcRenderer } from 'electron';
import { DeviceValues } from '@/definitions/device-values';

@Component({
  components: {
    SideBar,
  },
})
export default class Home extends Vue {
  socket = new Socket(ipcRenderer);

  waiting = false;

  connected = false;

  deviceValues: DeviceValues = {
    time: 0,
    master: 0,
    pause: 0,
    channels: {},
    battery: 0,
  };

  constructor() {
    super();
    this.socket.open('main-win');

    this.socket.onEvent('waiting-connection', () => {
      this.refreshStatus(true, false);
    });

    this.socket.onEvent('websocket-connect', (event) => {
      this.setDeviceValues(event.data);
      this.refreshStatus(false, true);
    });

    this.socket.onEvent('websocket-disconnect', () => {
      this.refreshStatus(false, false);
    });

    this.socket.onEvent('device-values', (event) => {
      this.setDeviceValues(event.data);
    });
  }

  refreshStatus(waiting: boolean, connected: boolean) {
    this.waiting = waiting;
    this.connected = connected;
  }

  setDeviceValues(values: DeviceValues) {
    console.log('setting device values', values);
    this.deviceValues = values;
  }
}
</script>
