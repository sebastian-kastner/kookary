<template>
  <VueFinalModal
    class="vfm-modal"
    content-class="vfm-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
  >
    <div class="d-flex justify-content-between">
      <h4 class="pe-5">Benutzer hinzufügen</h4>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        @click="$emit('cancel')"
      ></button>
    </div>
    <div class="form-group">
      <label for="email">eMail</label>
      <input
        id="email"
        v-model="email"
        type="email"
        class="form-control"
        placeholder="eMail"
      />
    </div>
    <div class="form-group">
      <label for="name">Name</label>
      <input
        id="name"
        v-model="displayname"
        type="text"
        class="form-control"
        placeholder="name"
      />
    </div>
    <div class="form-group">
      <label for="new-password">Passwort</label>
      <input
        id="new-password"
        v-model="password"
        type="password"
        class="form-control"
        placeholder="Neues Passwort"
        @keyup="pwCompare"
      />
    </div>

    <div class="form-group">
      <label for="new-password-repeated">Neues Passwort wiederholen</label>
      <input
        id="new-password-repeated"
        v-model="passwordRepeated"
        type="password"
        class="form-control"
        placeholder="Passwort wiederholung"
        @keyup="pwCompare"
      />
    </div>
    <div v-if="warningTxt != ''" class="alert alert-warning" warning="alert">
      {{ warningTxt }}
    </div>
    <div v-if="errorTxt != ''" class="alert alert-error" warning="alert">
      {{ errorTxt }}
    </div>

    <div class="d-flex justify-content-end">
      <button
        type="submit"
        class="btn btn-primary"
        :disabled="password != passwordRepeated"
        @click="createUser"
      >
        Hinzufügen
      </button>
    </div>
  </VueFinalModal>
</template>

<script lang="ts">
import { Vue, Component } from "vue-facing-decorator";
import { UserClient } from "../../clients/UserClient";
import { VueFinalModal } from "vue-final-modal";

@Component({ components: { VueFinalModal } })
export default class UserEditor extends Vue {
  private userClient = new UserClient();

  email = "";
  displayname = "";
  password = "";
  passwordRepeated = "";

  warningTxt = "";
  errorTxt = "";

  pwCompare(): void {
    if (
      this.password != "" &&
      this.passwordRepeated != "" &&
      this.password !== this.passwordRepeated
    ) {
      this.warningTxt = "Die Passwörter stimmen nicht überein.";
    } else {
      this.warningTxt = "";
    }
  }

  createUser(): void {
    this.errorTxt = "";

    if (this.email === "") {
      this.errorTxt = "Eine eMail Adresse muss angegeben werden!";
      return;
    }
    if (this.displayname === "") {
      this.errorTxt = "Ein Benutzername muss angegeben werden!";
      return;
    }
    if (this.password === "") {
      this.errorTxt = "Ein Passwort muss angegeben werden!";
      return;
    }

    this.userClient
      .createUser(this.email, this.displayname, this.password)
      .then((user) => {
        console.log(user);
        this.$emit("userAdded", user);
      })
      .catch((e) => {
        // const errorMessage = getErrorMessage(error);
        // this.$toast.open(
        //   `Fehler beim Anlegen des Benutzers: ${errorMessage}`
        // );
      });
  }
}
</script>
