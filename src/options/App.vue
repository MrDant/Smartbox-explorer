<template>
  <div style="width:100vw">
    <Header />
    <div v-if="selectedBox" class="siiimple-card">
      <div class="siimple-card-body siimple--mx-5 siimple--my-2" style="position: relative">
        <div
          class="siimple-btn siimple-btn--orange siimple--mx-2 siimple--my-2"
          style="position:absolute; top:0; right: 0"
          @click="syncSelectedBoxInfo"
          :disabled="loading.box"
        >
          <div class="load load-bouton" v-if="loading.box">
            <i class="fas fa-sync siimple--ml-1"></i>
          </div>

          <b :style="'visibility:' + (loading.box ? 'hidden' :'visible')">Synchroniser</b>
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
    <div class="siimple-card siimple--my-3">
      <div class="siimple-card-header siimple--mx-5">
        <div class="row">
          <label class="siimple-label">Les activités:</label>
          <input
            class="siimple-select siimple-btn--white"
            list="browsers"
            name="browser"
            id="browser"
            v-model="activitySelected"
          />
          <datalist id="browsers">
            <option
              v-for="(activity, index) of selectedBox ? selectedBox.activities_name : []"
              :key="index"
            >{{activity}}</option>
          </datalist>
          <div
            class="siimple-btn siimple-btn--orange siimple--mx-2 siimple--my-2"
            @click="addActivity()"
          >Ajouter</div>

          <span
            :class="{load: loading.activities}"
            class="hover siimple--mx-2"
            style="position: relative"
            @click="syncBoxActivities()"
            :disabled="loading.activities"
          >
            <i class="fas fa-sync"></i>
          </span>
          <div
            class="siimple-btn siimple-btn--primary siimple--ml-auto"
            @click="search()"
          >Rechercher</div>
        </div>
        <div class="siimple-progress siimple-progress--success" v-if="loading.activities">
          <span :style="{width: `${loading.activities}%`}">{{loading.activities}}% Completed</span>
        </div>
        <div class="row">
          <span
            class="chips siimple-tag siimple-tag--dark hover siimple--mx-3"
            v-for="(activity, index) of activitiesFilter.activities"
            :key="index"
            @click="removeActivity(activity)"
          >
            {{activity}}
            <i class="far fa-times-circle" style="padding-left: 0.5rem;"></i>
          </span>
        </div>
      </div>
      <div class="siimple-card-body siimple--mx-5 siimple--text-center activities-container">
        <span v-if="this.activities.length == 0">Aucun résultat</span>
        <Activity v-for="(activity, index) of activities" :key="index" :activity="activity" />
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../common/components/Header";
import Activity from "./Activity";
import BoxService from "../services/boxService";
import { map, filter } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";
export default {
  name: "App",
  data: () => {
    return {
      idBox: new URLSearchParams(window.location.search).get("box"),
      selectedBox: null,
      connected: true,
      boxService: null,
      loading: { box: false, activities: 0 },
      activitiesProgress: null,
      activitySelected: "",
      translation: {
        box_type: "Type",
        price: "Prix",
        quantity: "Quantité",
        variant: "Variante",
      },
      activitiesFilter: {
        activities: [],
      },
      activities: [],
    };
  },
  components: {
    Header,
    Activity,
  },
  methods: {
    removeActivity(activity) {
      this.activitiesFilter.activities = this.activitiesFilter.activities.filter(
        (name) => name != activity
      );
    },
    addActivity() {
      if (
        !this.activitiesFilter.activities.includes(this.activitySelected) &&
        this.activitySelected != ""
      ) {
        this.activitiesFilter.activities.push(this.activitySelected);
      }
      this.activitySelected = "";
    },
    syncSelectedBoxInfo() {
      this.loading.box = true;
      this.boxService.syncBoxInfo(this.selectedBox).subscribe({
        complete: () => (this.loading.box = false),
      });
    },
    watchSelectedBox() {
      this.boxService
        .getBoxById(this.idBox)
        .pipe(filter((data) => data != null))
        .subscribe((box) => {
          this.selectedBox = box;
        });
    },
    syncBoxActivities() {
      this.activitiesProgress.next(1);
      this.boxService
        .syncBoxActivities(this.selectedBox, this.activitiesProgress)
        .subscribe({
          complete: () => this.activitiesProgress.next(0),
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
    search() {
      this.addActivity();
      this.activities = this.selectedBox.activities.filter((activity) =>
        this.activitiesFilter.activities.find((name) => {
          return !!activity.name.toLowerCase().match(name.toLowerCase());
        })
      );
    },
  },
  created() {
    this.activitiesProgress = new BehaviorSubject(0);
    this.activitiesProgress.subscribe(
      (progress) => (this.loading.activities = progress)
    );
    this.boxService = BoxService.getInstance();
    this.watchSelectedBox();
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

.chips {
  font-size: 12px;
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
}

.load-bouton {
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

.siimple-card-header {
  display: flex;
  flex-direction: column;
}

.siimple-progress {
  background-color: white;
}

.activities-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
}

.row {
  display: flex;
  align-items: center;
  justify-content: start;
  flex-wrap: wrap;
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
