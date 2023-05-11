<template>
  <div id="user-mgt" class="container main-content padding-top">
    <h3>Benutzer</h3>
    <div id="add-user-button" class="row justify-content-end">
      <button @click="showAddUserModal" role="button" class="rounded-button">
        <b-icon-plus /> Benutzer hinzufügen
      </button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col" class="d-sm-none d-md-table-cell">eMail</th>
          <th scope="col">Roles</th>
          <th scope="col"></th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" v-bind:key="user.id">
          <th scope="row">{{ user.id }}</th>
          <td>{{ user.displayName }}</td>
          <td class="d-sm-none d-md-table-cell">{{ user.email }}</td>
          <td>{{ rolesToString(user) }}</td>
          <td>
            <button
              @click="deleteUser(user)"
              role="button"
              class="rounded-button"
            >
              <b-icon-trash />
            </button>
          </td>
          <td>
            <button
              @click="showEditDialog(user)"
              role="button"
              class="rounded-button"
            >
              <b-icon-pencil />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { User } from "../../types";
import { Options, Vue } from "vue-class-component";
import { UserClient } from "../../clients/UserClient";
import UserEditor from "../../components/admin/UserEditor.vue";
import AddUser from "../../components/admin/AddUser.vue";
import { getScreenWidth } from "../../utils/screenUtils";

@Options({})
export default class UserMgmtView extends Vue {
  private userClient = new UserClient();

  users: User[] = [];

  mounted(): void {
    this.userClient
      .getUsers()
      .then((users) => {
        this.users = users;
      })
      .catch(() => {
        // bestest error handling in the world!
        this.users.push({
          id: 0,
          displayName: "Fehler beim Laden der Benutzer",
        });
      });
  }

  showEditDialog(user: User): void {
    // this.$modal.show(
    //   UserEditor,
    //   { user: user },
    //   { height: 470, width: getScreenWidth(400) }
    // );
  }

  showAddUserModal(): void {
    // this.$modal.show(
    //   AddUser,
    //   { userAddedCallback: (user: User) => { this.users.push(user) } },
    //   { height: "auto", width: getScreenWidth(400) }
    // );
  }

  deleteUser(user: User): void {
    const userId = user.id;

    if (!userId) {
      throw new Error("Zu löschender Benutzer hat keine ID!");
    }

    // this.$modal.show('dialog', {
    //   title: "Benutzer " + user.displayName + " löschen",
    //   text: "Soll der Benutzer " + user.displayName + " wirklich gelöscht werden?",
    //   buttons: [
    //     {
    //       title: 'Abbrechen',
    //       handler: () => {
    //         this.$modal.hide('dialog')
    //       }
    //     },
    //     {
    //       title: 'Löschen',
    //       handler: () => {
    //         this.userClient.deleteUser(userId)
    //         .then(() => {
    //           this.users.splice(this.users.indexOf(user), 2);
    //         });
    //         this.$modal.hide('dialog');
    //       }
    //     }
    //   ]
    // });
  }

  rolesToString(user: User): string {
    if (user.roles) {
      const out: string[] = [];
      const rolePrefix = "ROLE_";
      user.roles.forEach((role) => {
        if (role.startsWith(rolePrefix)) {
          out.push(role.slice(rolePrefix.length));
        } else {
          out.push(role);
        }
      });
      return out.sort().join(", ");
    }
    return "";
  }
}
</script>

<style lang="scss">
@import "../../../main.scss";

#add-user-button {
  padding: $content-padding * 2;
}
</style>
