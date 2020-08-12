<template>
  <div class="siimple-navbar siimple-navbar--dark siimple-navbar--fluid">
    <a class="siimple-navbar-title" @click="goToHome">
      SmartBox Explorer
      <span class="siimple--ml-1">
        <i class="fas fa-search secondary"></i>
      </span>
    </a>
    <div class="siimple--float-right siimple--ml-5">
      <a class="siimple-navbar-item hover" @click="goTologinPage">
        {{
        !connected ? "Se connecter" : "Se reconnecter"
        }}
      </a>
    </div>
  </div>
</template>

<script>
import ChromeWindow from "../utils/chromeWindow";
import Api from "../../models/api";
import "@fortawesome/fontawesome-free/js/fontawesome";
import "@fortawesome/fontawesome-free/js/solid";
import "@fortawesome/fontawesome-free/js/regular";
import "@fortawesome/fontawesome-free/js/brands";
export default {
  name: "App",
  data: () => {
    return {
      idBox: new URLSearchParams(window.location.search).get("box"),
      connected: true,
    };
  },
  methods: {
    checkConnexion() {
      chrome.cookies.getAll(
        { domain: "www.smartbox.com", name: "frontend" },
        function (cookies) {
          this.connected = cookies.length == 1;
        }
      );
    },
    goToHome() {
      ChromeWindow.focusTo(chrome.extension.getURL("./options/options.html"));
    },
    goTologinPage() {
      ChromeWindow.focusTo(Api.login);
    },
  },
  created() {
    this.checkConnexion();
  },
};
</script>

<style scoped>
</style>
