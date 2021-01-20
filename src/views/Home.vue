<template>
  <div class="flex flex-col-reverse sm:flex-row flex-grow">
    <div class="sm:w-8/12 p-2 h-full">
      <div class=" bg-gray-700 p-2 rounded h-full flex items-center justify-center">
        TODO: Content here
      </div>
    </div>
    <div class="sm:w-4/12 p-2 flex-grow">
      <SideBar></SideBar>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue';
import SideBar from '@/components/SideBar.vue';

@Component({
  components: {
    SideBar,
    HelloWorld,
  },
})
export default class Home extends Vue {
}
</script>
