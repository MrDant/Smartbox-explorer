<template>
  <div class="siimple-card" style="width: max-content">
    <div class="siimple-card-body">
      <Carousel :sliderClass="sliderClass">
        <div
          class="slide"
          v-for="(img, index) of activity.image_gallery"
          :key="index"
        >
          <img :src="img" @click="goToBuy()" />
        </div>
      </Carousel>
      <div class="activity-name">{{ activity.name }}</div>
      <div class="activity-details primary">
        <div id="description">{{ activity.short_description }}</div>
        <div id="distance" v-if="distance">
          <i class="fas fa-map-marker-alt"></i> {{ distance }} km
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ChromeWindow from "../common/utils/chromeWindow";
import "vue-snap/dist/vue-snap.css";
import Carousel from "../common/components/Carousel";
export default {
  name: "App",
  props: ["activity"],
  data: () => {
    return {
      sliderClass: "hover",
      distance: null,
    };
  },
  components: {
    Carousel,
  },
  methods: {
    goToBuy() {
      ChromeWindow.focusTo(this.activity.url);
    },
    getDistance(lat1, lat2, lon1, lon2) {
      var R = 6378.137; // Radius of earth in KM
      var dLat = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180;
      var dLon = (lon2 * Math.PI) / 180 - (lon1 * Math.PI) / 180;
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return Math.round(d * 100) / 100;
    },
  },
  created() {
    console.log(this.activity);
    navigator.geolocation.getCurrentPosition((geo) => {
      this.distance = this.getDistance(
        geo.coords.latitude,
        this.activity.gps_latitude,
        geo.coords.longitude,
        this.activity.gps_longitude
      );
    });
  },
};
</script>

<style scoped>
.activity-name {
  font-size: 1.5rem;
  font-weight: 500;
}
.activity-details {
  font-size: 0.8rem;
}
</style>
