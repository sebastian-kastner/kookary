<template>
  <div id="user-menu">
    <router-link class="dropdown-item d-flex align-items-center" to="#">
      <b-icon-basket /> Einkaufsliste
    </router-link>

    <router-link class="dropdown-item d-flex align-items-center" to="#">
      <b-icon-list-task /> Merkliste
    </router-link>

    <router-link
      v-if="isAdmin"
      class="dropdown-item d-flex align-items-center"
      to="#"
    >
      <b-icon-shield-lock /> Administration
    </router-link>

    <div class="dropdown-divider"></div>
    <a href="#" class="dropdown-item d-flex align-items-center" @click="logout">
      <b-icon-box-arrow-in-left /> Logout
    </a>
    
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { userStore } from "../../stores/rootStore";

@Component({})
export default class UserMenu extends Vue {
  get isAdmin(): boolean {
    return userStore.userIsAdmin;
  }

  logout(): void {
    userStore.logout();
  }
}
</script>

<style lang="scss">
@import "../../../main.scss";
</style>
