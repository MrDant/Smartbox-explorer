<template>
  <div style="width:100vw">
    <Header />
  </div>
</template>

<script>
import Header from "../common/components/Header";
export default {
  name: "App",
  data: () => {
    return {
      idBox: new URLSearchParams(window.location.search).get("box"),
      connected: true,
    };
  },
  components: {
    Header,
  },
};
</script>

<style scoped>
</style>
