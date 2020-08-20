<template>
  <div class="siimple-card">
    <div class="siimple-card-body">
      <Carousel :sliderClass="sliderClass">
        <div class="slide pointer" v-for="(img, index) of activity.image_gallery" :key="index">
          <img :src="img" @click="goToBuy()" />
        </div>
      </Carousel>
      <div class="activity-name">{{ activity.name }}</div>
      <div class="activity-details primary">
        <div id="description">{{ activity.short_description }}</div>
        <div id="distance" v-if="!!this.distance.maps">
          <a :href="this.distance.maps" class="hover primary" target="_blank">
            <i class="fas fa-map-marker-alt"></i>
            {{ this.distance.km }} km
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ChromeWindow from "../common/utils/chromeWindow";
import StreamReader from "../common/utils/streamReader";
import Carousel from "../common/components/Carousel";
import Api from "../models/api";
export default {
  name: "App",
  props: ["activity"],
  data: () => {
    return {
      sliderClass: "hover",
      distance: { maps: null, km: null },
    };
  },
  components: {
    Carousel,
  },
  methods: {
    goToBuy() {
      ChromeWindow.focusTo(this.activity.url);
    },
    getMapLink() {
      let getMinute = (val) => {
        return +("0." + val.toString().split(".")[1]) * 60;
      };
      let formatCoordinate = (val) => {
        return {
          deg: val.toString().split(".")[0],
          min: Math.floor(getMinute(val)),
          sec: Math.floor(getMinute(getMinute(val)) * 10) / 10,
        };
      };
      let lat = formatCoordinate(this.activity.gps_latitude);
      let long = formatCoordinate(this.activity.gps_longitude);
      return `${Api.googleMaps}${Math.abs(lat.deg)}°${lat.min}'${lat.sec}${
        lat.deg < 0 ? "S" : "N"
      }+${Math.abs(long.deg)}°${long.min}'${long.sec}${
        long.deg < 0 ? "W" : "E"
      }`;
    },
    getDistance(lat1, lat2, lon1, lon2) {
      let stream = new StreamReader(
        `http://router.project-osrm.org/route/v1/car/${lon1},${lat1};${lon2},${lat2}`
      );
      stream.extractDataToJson().subscribe((data) => {
        this.distance.km = Math.floor(data.routes[0].distance / 10) / 100;
      });
      this.distance.maps = this.getMapLink();
    },
  },
  created() {
    navigator.geolocation.getCurrentPosition((geo) => {
      this.getDistance(
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
  display: flex;
  flex-direction: column;
  align-items: center;
}
.activity-details * {
  max-width: 50%;
}
.siimple-card {
  flex-basis: 20%;
}
</style>
