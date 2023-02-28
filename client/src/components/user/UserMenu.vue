<template>
  <div id="user-menu">
    <router-link class="dropdown-item d-flex align-items-center" to="/user/shopping-list">
      <b-icon-basket /> Einkaufsliste
    </router-link>

    <router-link class="dropdown-item d-flex align-items-center" to="#">
      <b-icon-list-task /> Merkliste
    </router-link>

    <div class="dropdown-divider"></div>

    <div v-if="isAdmin">
      <router-link v-if="isAdmin" class="dropdown-item d-flex align-items-center" to="/admin/users">
        <b-icon-people /> Benutzerverwaltung
      </router-link>

      <router-link v-if="isAdmin" class="dropdown-item d-flex align-items-center" to="/admin/ingredients">
        <b-icon-bag /> Zutatenverwaltung
      </router-link>
    </div>

    <div class="dropdown-divider"></div>

    <router-link class="dropdown-item d-flex align-items-center" to="/user/account">
      <b-icon-person /> Benutzerkonto
    </router-link>

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
    if (this.$route.path.startsWith("/user")) {
      this.$router.push({ path: "/" });
    }
  }
}
</script>

<style lang="scss">
@import "../../../main.scss";
</style>
