<template>
  <div id="user-mgt" class="container main-content padding-top">
    <h3>Benutzer</h3>
    <div id="add-user-button" class="d-flex justify-content-end">
      <button
        role="button"
        class="btn btn-outline-primary"
        @click="showAddUserModal"
      >
        <Icon icon="plus" /> Benutzer hinzufügen
      </button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col" class="d-sm-none d-md-table-cell">eMail</th>
          <th scope="col">Roles</th>
          <th scope="col" />
          <th scope="col" />
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <th scope="row">
            {{ user.id }}
          </th>
          <td>{{ user.displayName }}</td>
          <td class="d-sm-none d-md-table-cell">
            {{ user.email }}
          </td>
          <td>{{ rolesToString(user) }}</td>
          <td>
            <button class="rounded-button" @click="deleteUser(user)">
              <Icon icon="trash" />
            </button>
          </td>
          <td>
            <button class="rounded-button" @click="showEditDialog(user)">
              <Icon icon="pencil" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { User } from "../../types";
import { Component, mixins } from "vue-facing-decorator";
import { UserClient } from "../../clients/UserClient";
import ToastMixin from "../../mixins/ToastMixin.vue";
import { useModal } from "vue-final-modal";
import UserEditor from "../../components/admin/UserEditor.vue";
import AddUser from "../../components/admin/AddUser.vue";
import DialogModal from "../../components/DialogModal.vue";
import { getErrorMessage } from "../../utils/errors";
import { Icon } from "@iconify/vue/dist/offline";

@Component({
  components: {
    Icon,
  },
})
export default class UserMgmtView extends mixins(ToastMixin) {
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
    const { open, close } = useModal({
      component: UserEditor,
      attrs: {
        user: user,
        onUserEdited(): void {
          close();
        },
        onCancel(): void {
          close();
        },
      },
    });
    open();
  }

  showAddUserModal(): void {
    const addUserHandler = (user: User) => {
      this.users.push(user);
    };
    const { open, close } = useModal({
      component: AddUser,
      attrs: {
        onUserAdded(user: User) {
          addUserHandler(user);
          close();
        },
        onCancel() {
          close();
        },
      },
    });
    open();
  }

  deleteUser(user: User): void {
    const userId = user.id;

    if (!userId) {
      throw new Error("Zu löschender Benutzer hat keine ID!");
    }

    const deleteHandler = () => {
      return new Promise<void>((resolve, reject) => {
        this.userClient
          .deleteUser(userId)
          .then(() => {
            this.users.splice(this.users.indexOf(user), 2);
            resolve();
          })
          .catch((e) => {
            reject(e);
            const errorMessage = getErrorMessage(e);
            this.showToast.error(
              `Fehler beim Löschen von Benutzer ${user.displayName}: ${errorMessage}`
            );
          });
      });
    };

    const { open, close } = useModal({
      component: DialogModal,
      attrs: {
        title: `Benutzer ${user.displayName} löschen`,
        text: `Soll der Benutzer ${user.displayName} wirklich gelöscht werden?`,
        confirmText: "Löschen",
        cancelText: "Abbrechen",
        onConfirm() {
          deleteHandler().finally(() => close());
        },
        onCancel() {
          close();
        },
      },
    });
    open();
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
@import "../../styles/variables.scss";

#add-user-button {
  padding: $content-padding * 2;
}
</style>
