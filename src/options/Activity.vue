<template>
  <div class="siimple-card" @click="goToBuy()" style="width: max-content">
    <div class="siimple-card-body">
      <img :src="activity.image_gallery[0]" />
      <div>{{activity.name}}</div>
    </div>
  </div>
</template>
<script>
import ChromeWindow from "../common/utils/chromeWindow";
export default {
  name: "App",
  props: ["activity"],
  data: () => {
    return {};
  },
  components: {},
  methods: {
    goToBuy() {
      ChromeWindow.focusTo(this.activity.url);
    },
  },
  created() {
    console.log(this.activity);
  },
};
</script>

<style scoped>
</style>
