<template>
  <div class="container">
    <h3>Benutzer {{ user.displayName }} bearbeiten</h3>

    <div class="container">
      <hr />
      <div class="row">
        <div class="col">
          <h4>Rollen</h4>
        </div>
        <div class="col">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="ROLE_ADMIN" v-model="isAdmin"
              :disabled="isLoggedInUser()" @change="adminStateChanged">
            <label class="form-check-label" for="ROLE_ADMIN">
              Admin
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="ROLE_USER" checked disabled>
            <label class="form-check-label" for="ROLE_USER">
              Benutzer
            </label>
          </div>
        </div>
      </div>

      <hr />

      <h4>Neues Passwort</h4>
      <div class="form-group">
        <label for="new-password">Neues Passwort</label>
        <input v-on:keyup="pwCompare" type="password" class="form-control" id="new-password"
          placeholder="Neues Passwort" v-model="newPassword" :disabled="isLoggedInUser()"/>
      </div>

      <div class="form-group">
        <label for="new-password-repeated">Neues Passwort wiederholen</label>
        <input v-on:keyup="pwCompare" type="password" class="form-control" id="new-password-repeated"
          placeholder="Passwort Wiederholung" v-model="newPasswordRepeated" :disabled="isLoggedInUser()"/>
      </div>

      <div v-if="warningTxt != ''" class="alert alert-warning" warning="alert">
        {{ warningTxt }}
      </div>

      <button type="submit" class="btn btn-primary" :disabled="newPassword != newPasswordRepeated || isLoggedInUser()"
        @click="changePassword">
        Passwort Ändern
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { User } from "../../types";
import { userStore } from "../../stores/rootStore"
import { UserClient } from "../../clients/UserClient"
import { cloneDeep } from "lodash";

@Component({})
export default class UserEditor extends Vue {
  @Prop({ required: true }) user!: User;

  private userClient = new UserClient();

  isAdmin = false;

  newPassword = "";
  newPasswordRepeated = "";
  warningTxt = "";

  mounted(): void {
    if (this.user.roles) {
      this.isAdmin = this.user.roles?.has("ROLE_ADMIN");
    }
  }

  isLoggedInUser(): boolean {
    // make sure that the logged in admin cannot change his own admin status..
    return userStore.user?.id === this.user.id;
  }

  async adminStateChanged(): Promise<void> {
    let roles = cloneDeep(this.user.roles);
    if (!roles) {
      roles = new Set<string>();
    }

    const hasAdminRole = roles.has("ROLE_ADMIN");
    if (this.isAdmin && !hasAdminRole) {
      roles.add("ROLE_ADMIN");
    } else if (!this.isAdmin && hasAdminRole) {
      roles.delete("ROLE_ADMIN");
    }

    // TBD: error handling..
    this.userClient.updateUser({
      id: this.user.id,
      roles: roles,
    }).then(() => {
      this.user.roles = roles;
    });
  }

  pwCompare(): void {
    if (this.newPassword != "" && this.newPasswordRepeated != "" && this.newPassword !== this.newPasswordRepeated) {
      this.warningTxt = "Die neuen Passwörter stimmen nicht überein."
    } else {
      this.warningTxt = "";
    }
  }

  changePassword(): void {
    if (!this.user.id) {
      throw new Error("Keine Benutzer ID gesetzt");
    }
    this.userClient.changePassword(this.user.id, this.newPassword)
      .then(() => {
        this.$modal.hideAll();
      })
  }

}
</script>
