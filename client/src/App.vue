<template>
  <div id="app">
    <v-dialog />

    <div class="topbar">
      <div class="d-flex justify-content-between align-items-center container">
        <div class="topbar-left">
          <!-- burger menu; only visible on screens smaller than large -->
          <div class="d-lg-none d-inline">
            <span
              class="btn"
              id="burger-menu"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <b-icon-list />
            </span>
            <div class="dropdown-menu" aria-labelledby="burger-menu">
              <router-link
                v-for="navItem in navItems"
                v-bind:key="navItem.name"
                class="dropdown-item d-flex align-items-center"
                :to="navItem.to"
              >
                <component :is="navItem.icon" />{{ navItem.name }}
              </router-link>
            </div>
          </div>

          <router-link class="navbar-brand" to="/"
            >&#129348; kookary</router-link
          >
        </div>

        <!-- nav items in middle; only visible on large screens -->
        <div class="d-none d-lg-block">
          <router-link
            v-for="navItem in navItems"
            v-bind:key="navItem.name"
            :to="navItem.to"
            class="nav-button"
            >{{ navItem.name }}</router-link
          >
        </div>

        <div class="topbar-right">
          <!-- Login button and login form if user is not logged in -->
          <span
            class="btn dropdown-toggle"
            type="button"
            id="user-dropdown-button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <span v-if="user === null">
              <b-icon-box-arrow-in-right /> Login
            </span>
            <span v-else>
              <b-icon-person-circle /> {{ user.displayName }}
            </span>
          </span>
          <div class="dropdown-menu" aria-labelledby="user-dropdown-button">
            <login-view v-if="user === null" />
            <user-menu v-else />
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
import { Component, Vue } from "vue-facing-decorator";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { userStore } from "./stores/rootStore";
import { User } from "./types";
import { UserStore } from "./stores/userStore";
import LoginView from "./components/user/LoginView.vue";
import UserMenu from "./components/user/UserMenu.vue";
import { BIconListOl, BIconPlusCircle, BIconCalendarWeek } from "bootstrap-vue";

export type NavItem = {
  name: string;
  to: string;
  icon: unknown;
};

@Component({
  components: {
    LoginView,
    UserMenu,
  },
})
export default class App extends Vue {
  get user(): User | null {
    return userStore.user;
  }

  get userStore(): UserStore {
    return userStore;
  }

  get navItems(): NavItem[] {
    const items: NavItem[] = [];
    items.push({
      icon: BIconListOl,
      name: "Rezepte",
      to: "/recipes",
    });
    if (this.user) {
      items.push({
        icon: BIconPlusCircle,
        name: "Neues Rezept",
        to: "/user/recipe-editor",
      });
    }
    items.push({
      icon: BIconCalendarWeek,
      name: "Saisonkalender",
      to: "/calendar",
    });
    return items;
  }
}
</script>

<style lang="scss">
@import "../main.scss";

body {
  overflow-x: hidden;
}

#app,
.vm--modal {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

// this prevents the layout from jumping if the scrollbar appears
#app {
  width: 100vw;
}

.topbar {
  padding-top: 20px;
  padding-bottom: 20px;

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
    color: $link-color-main;
    padding: 0 5px 10px 5px;
  }

  .nav-button:hover {
    text-decoration: none;
  }

  .nav-button.router-link-active {
    border-bottom: 2px solid $button-color-main;
  }

  .dropdown-menu {
    min-width: 250px;

    a {
      height: 3em;

      svg {
        font-size: 1.5em;
        padding-bottom: 3px;
        margin-right: 8px;
      }
    }
  }

  #burger-menu {
    padding-top: 0;
  }

  #user-dropdown-button,
  #burger-menu {
    svg {
      font-size: 1.5em;
      padding-bottom: 3px;
    }
  }
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
