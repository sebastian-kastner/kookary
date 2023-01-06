<template>
  <div id="user-mgt" class="container main-content padding-top">
    <h3>Benutzer</h3>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col">eMail</th>
          <th scope="col">Roles</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" v-bind:key="user.id">
          <th scope="row">{{ user.id }}</th>
          <td>{{ user.displayName }}</td>
          <td>{{ user.email }}</td>
          <td>{{ rolesToString(user) }}</td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script lang="ts">
import { User } from "../../types";
import { Component, Vue } from "vue-property-decorator";
import { UserClient } from "../../clients/UserClient"

@Component({})
export default class UserMgmtView extends Vue {
  private userClient = new UserClient();

  users: User[] = [];

  mounted(): void {
    this.userClient.getUsers().then((users) => {
      this.users = users;
    }).catch(() => {
      // bestest error handling in the world!
      this.users.push({
        id: 0,
        displayName: "Fehler beim Laden der Benutzer"
      });
    });
  }

  rolesToString(user: User): string {
    if (user.roles) {
      const out: string[] = [];
      user.roles.forEach((role) => {
        if (role.startsWith("ROLE_")) {
          out.push(role.slice(5));
        } else {
          out.push(role);
        }
      })
      return out.join(', ');
    }
    return "";
  }
}
</script>

<style lang="scss">
@import "../../../main.scss";

#account {
  padding: $content-padding;

  #account-details {
    margin-bottom: 2em;
  }
}
</style>
