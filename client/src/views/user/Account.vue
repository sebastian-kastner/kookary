<template>
  <div id="account" class="main-content">
    <h3>Benutzerkonto</h3>

    <div class="container" id="account-details">
      <div class="row">
        <div class="col-4">Benutzername</div>
        <div class="col-8">{{ userName }}</div>
      </div>
      <div class="row">
        <div class="col-4">eMail Adresse</div>
        <div class="col-8">{{ email }}</div>
      </div>
    </div>

    <h3>Passwort ändern</h3>

    <div class="form-group">
      <label for="old-password">Aktuelles Passwort</label>
      <input
        type="password"
        class="form-control"
        id="old-password"
        placeholder="Aktuelles Passwort"
        v-model="oldPassword"
      />
    </div>

    <div class="form-group">
      <label for="new-password">Neues Passwort</label>
      <input
        v-on:keyup="pwCompare"
        type="password"
        class="form-control"
        id="new-password"
        placeholder="Neues Passwort"
        v-model="newPassword"
      />
    </div>

    <div class="form-group">
      <label for="new-password-repeated">Neues Passwort wiederholen</label>
      <input
        v-on:keyup="pwCompare"
        type="password"
        class="form-control"
        id="new-password-repeated"
        placeholder="Neues Passwort"
        v-model="newPasswordRepeated"
      />
    </div>

    <div v-if="errorTxt != ''" class="alert alert-danger" role="alert">
      {{ errorTxt }}
    </div>

    <div v-if="warningTxt != ''" class="alert alert-warning" warning="alert">
      {{ warningTxt }}
    </div>

    <div v-if="changed" class="alert alert-success" role="alert">
      Passwort erfolgreich geändert!
    </div>

    <button
      type="submit"
      class="btn btn-primary"
      :disabled="newPassword != newPasswordRepeated || changed"
      @click="changePassword"
    >
      Ändern
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { userStore } from "../../stores/rootStore";
import { UserClient } from "../../clients/UserClient";
import debounce from "lodash.debounce";

@Component({})
export default class Account extends Vue {
  oldPassword = "";
  newPassword = "";
  newPasswordRepeated = "";

  errorTxt = "";
  warningTxt = "";

  changed = false;

  private userClient = new UserClient();

  debouncedPwCompare = debounce(() => {
    this.pwCompare();
  }, 750);

  get userName(): string {
    if (!userStore.user || !userStore.user.displayName) {
      return "";
    }
    return userStore.user.displayName;
  }

  get email(): string {
    if (!userStore.user || !userStore.user.email) {
      return "";
    }
    return userStore.user.email;
  }

  pwCompare(): void {
    if (
      this.newPassword != "" &&
      this.newPasswordRepeated != "" &&
      this.newPassword !== this.newPasswordRepeated
    ) {
      this.warningTxt = "Die neuen Passwörter stimmen nicht überein.";
    } else {
      this.warningTxt = "";
    }
  }

  changePassword(): void {
    const userId = userStore.user?.id;

    // reset statuses
    this.changed = false;
    this.errorTxt = "";

    if (!userId) {
      throw new Error("No user logged in, cannot change password");
    }
    this.userClient
      .changePassword(userId, this.newPassword, this.oldPassword)
      .then(() => {
        this.changed = true;
      })
      .catch((err) => {
        this.errorTxt = err;
      });
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
