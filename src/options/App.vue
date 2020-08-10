<template>
  <div style="width:100vw">
    <Header />
    <div v-if="selectedBox" class="siiimple-card">
      <div class="siimple-card-body siimple--mx-5 siimple--my-2" style="position: relative">
        <div
          class="siimple-btn siimple-btn--orange siimple--mx-2 siimple--my-2"
          style="position:absolute; top:0; right: 0"
          @click="syncSelectedBox"
        >
          <div class="load" v-if="load">
            <i class="fas fa-sync siimple--ml-1"></i>
          </div>

          <span :style="'visibility:' + (load ? 'hidden' :'visible')">Synchronize</span>
        </div>

        <div class="siimple-grid">
          <div class="siimple-grid-row">
            <div class="siimple-grid-col siimple-grid-col--3 siimple--px-2">
              <img :src="selectedBox.img" />
            </div>
            <div class="siimple-grid-col siimple-grid-col--9">
              <div class="siimple-box-title">{{selectedBox.name}}</div>
              <div class="siimple-box-subtitle">{{selectedBox.category}}</div>
              <div class="box_info-container siimple--mt-3">
                <div
                  class="box_info-col"
                  v-for="(info, label) in getInfoFiltered(selectedBox)"
                  :key="label"
                >{{translation[label]}} -> {{info}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../common/components/Header";
import BoxService from "../services/boxService";
import { map } from "rxjs/operators";
export default {
  name: "App",
  data: () => {
    return {
      idBox: new URLSearchParams(window.location.search).get("box"),
      selectedBox: null,
      connected: true,
      boxService: null,
      load: false,
      translation: {
        box_type: "Type",
        price: "Prix",
        quantity: "Quantité",
        variant: "Variante",
      },
    };
  },
  components: {
    Header,
  },
  methods: {
    syncSelectedBox() {
      this.load = true;
      this.boxService.syncBox(this.selectedBox).subscribe({
        next: (box) => (this.selectedBox = box),
        complete: () => (this.load = false),
      });
    },
    getInfoFiltered(box) {
      if (!box) return null;
      let res = {};
      Object.keys(this.selectedBox.info).forEach((label) => {
        if (this.translation[label]) {
          res[label] = box.info[label];
        }
      });
      return res;
    },
  },
  created() {
    this.boxService = BoxService.getInstance();
    this.boxService
      .getBoxById(this.idBox)
      .pipe(
        map((box) => {
          if (!box) return null;
          Object.keys(box.info).forEach((label) => {
            if (!this.translation[label]) {
              delete box.info[label];
            }
          });
          return box;
        })
      )
      .subscribe((box) => {
        this.selectedBox = box;
      });
  },
};
</script>

<style scoped>
.box_info-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.box_info-col {
  width: 50%;
}

.load {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.load * {
  -webkit-animation: rotation 2s linear infinite;
  -moz-animation: rotation 2s linear infinite;
  -ms-animation: rotation 2s linear infinite;
}

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
