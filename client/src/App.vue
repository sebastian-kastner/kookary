<template>
  <div id="app">
    <div class="topbar">
      <div class="d-flex justify-content-between container">
        <div class="topbar-left">
          <!-- <nav class="navbar navbar-expand-lg navbar-light">
              <button
                class="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarText"
                aria-controls="navbarText"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarText">
                <ul class="navbar-nav mr-auto">
                  <li class="nav-item">
                    <router-link class="nav-link" to="/ingredients"
                      >Ingredients</router-link
                    >
                  </li>
                </ul>
              </div>
            </nav> -->
          <router-link class="navbar-brand" to="/">&#129348; kookary</router-link>
        </div>

        <div class="topbar-right">
          <router-link class="btn nav-button rounded-button" to="/recipes"
            >recipes</router-link
          >
          <router-link class="btn nav-button rounded-button" to="/recipe-editor"
            >+ add recipe</router-link
          >

          <router-link v-if="user === null" class="btn icon-button" to="/login">
              <b-icon-box-arrow-in-right /> Login
          </router-link>
          <div v-else class="btn icon-button" @click="userStore.logout">
            <b-icon-person-circle /> {{ user.displayName }}
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="main-wrapper container">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { BIconBoxArrowInRight, BIconPersonCircle } from "bootstrap-vue";
import { userStore } from "./stores/rootStore"
import { User } from "./types";
import { UserStore } from "./stores/userStore";

@Component({
  components: {
    BIconBoxArrowInRight,
    BIconPersonCircle
  },
})
export default class App extends Vue {
  get user(): User | null {
    return userStore.user;
  }
  get userStore(): UserStore {
    return userStore;
  }
}
</script>

<style lang="scss">
@import "../main.scss";

#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.topbar {
  padding-top: 40px;
  padding-bottom: 40px;

  position: sticky;
  top: 0;
  background-color: $background-color-main;
  border-bottom: 2px solid $background-color-highlight-1;
  box-shadow: 0 6px 10px $background-color-highlight-1;
  z-index: 10;

  .navbar-brand {
    font-family: Helvetica, Arial, sans-serif;
    font-weight: bold;
    font-size: 20pt;
    color: black;

    a {
      color: black;
    }
  }

  .nav-button {
    min-width: 125px;
    margin-left: 10px;
  }

  .icon-button {
    font-size: 1.5em;
  }
}

nav {
  padding: 30px;

  // can this be removed? this seems to be for the hamburger menu entries which does currently not exist
  // a {
  //   font-weight: bold;
  //   color: $gray !important;

  //   &.router-link-exact-active {
  //     color: lighten($gray, 25%) !important;
  //   }
  // }
}

.main {
  background-image: url("~@/../public/partial_bg.png");
  background-repeat: repeat-x;
  padding-top: 15px;
}
.main-wrapper {
  margin-bottom: 50px;
}
</style>
