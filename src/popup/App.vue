<template>
  <div>
    <Header />
    <div class="siimple-content">
      <div class="siimple-h6 siimple--text-center">
<<<<<<< HEAD
        Vous possédez {{ boxes ? Object.keys(boxes).length : "..." }} SmartBox
=======
        Vous possédez {{ boxes ? boxes.length : "..." }} SmartBox
>>>>>>> 2efe523... update structure
        <span
          @click="doSyncBoxs"
          :class="{ load: load }"
        >
          <i class="fas fa-sync siimple--ml-1 hover"></i>
        </span>
        <div
          class="siimple-card siimple--my-2 siimple--mx-5"
          style="width: auto"
          v-for="(box, index) in boxes"
          :key="index"
        >
<<<<<<< HEAD
          <div class="siimple-card-body" @click="goToOptionPage(box.info.id)">
=======
          <div class="siimple-card-body" @click="goToHome">
>>>>>>> 2efe523... update structure
            <img :src="box.img" />
            <!-- <div class="siimple-card-title">{{ box.info.name }}</div> -->
          </div>
          <div class="siimple-card-footer">{{ box.info.name }} : {{ box.info.price }} €</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../common/components/Header";
import BoxService from "../services/boxService";
import Api from "../models/api.js";
import ChromeWindow from "../common/utils/chromeWindow";
import "@fortawesome/fontawesome-free/js/fontawesome";
import "@fortawesome/fontawesome-free/js/solid";
import "@fortawesome/fontawesome-free/js/regular";
import "@fortawesome/fontawesome-free/js/brands";

export default {
  name: "App",
  data: () => {
    return {
      boxes: [],
      boxService: null,
      load: false,
    };
  },
  methods: {
<<<<<<< HEAD
    goToOptionPage(id = "") {
      ChromeWindow.focusTo(
        chrome.extension.getURL(
          "./options/options.html" + (id ? "?box=" + id : "")
        )
      );
=======
    goToHome() {
      ChromeWindow.focusTo(chrome.extension.getURL("./options/index.html"));
>>>>>>> 2efe523... update structure
    },
    goTologinPage() {
      ChromeWindow.focusTo(Api.login);
    },
    doSyncBoxs() {
      this.load = true;
      this.boxService.syncBoxes().subscribe({
        complete: () => {
          this.load = false;
        },
      });
    },
  },
  components: {
    Header,
  },
  created() {
    this.boxService = BoxService.getInstance();
    this.boxService.boxes$.subscribe((data) => {
      this.boxes = data;
    });
  },
};
</script>

<style scoped>
<<<<<<< HEAD
.siimple-card {
  cursor: pointer;
}
=======
>>>>>>> 2efe523... update structure
.load * {
  -webkit-animation: rotation 2s linear infinite;
  -moz-animation: rotation 2s linear infinite;
  -ms-animation: rotation 2s linear infinite;
}

<<<<<<< HEAD
=======
.siimple-card {
  cursor: pointer;
}

>>>>>>> 2efe523... update structure
@-webkit-keyframes rotation {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@-moz-keyframes rotation {
  0% {
    -moz-transform: rotate(0deg);
  }
  100% {
    -moz-transform: rotate(360deg);
  }
}
@-ms-keyframes rotation {
  0% {
    -ms-transform: rotate(0deg);
  }
  100% {
    -ms-transform: rotate(360deg);
  }
}
</style>
