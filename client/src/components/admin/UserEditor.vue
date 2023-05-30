<template>
  <VueFinalModal
    class="vfm-modal"
    content-class="vfm-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
  >
    <div class="d-flex justify-content-between">
      <h4 class="pe-5">Benutzer bearbeiten</h4>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        @click="$emit('cancel')"
      ></button>
    </div>
    <span>{{ user.email }}</span>
    <div class="container">
      <hr />
      <div class="row">
        <div class="col">
          <h4>Rollen</h4>
        </div>
        <div class="col">
          <div class="form-check">
            <input
              id="ROLE_ADMIN"
              v-model="isAdmin"
              class="form-check-input"
              type="checkbox"
              value=""
              :disabled="isLoggedInUser()"
              @change="adminStateChanged"
            />
            <label class="form-check-label" for="ROLE_ADMIN"> Admin </label>
          </div>
          <div class="form-check">
            <input
              id="ROLE_USER"
              class="form-check-input"
              type="checkbox"
              value=""
              checked
              disabled
            />
            <label class="form-check-label" for="ROLE_USER"> Benutzer </label>
          </div>
        </div>
      </div>

      <hr />

      <h4>Neues Passwort</h4>
      <div class="form-group">
        <label for="new-password">Neues Passwort</label>
        <input
          id="new-password"
          v-model="newPassword"
          type="password"
          class="form-control"
          placeholder="Neues Passwort"
          :disabled="isLoggedInUser()"
          @keyup="pwCompare"
        />
      </div>

      <div class="form-group">
        <label for="new-password-repeated">Neues Passwort wiederholen</label>
        <input
          id="new-password-repeated"
          v-model="newPasswordRepeated"
          type="password"
          class="form-control"
          placeholder="Passwort Wiederholung"
          :disabled="isLoggedInUser()"
          @keyup="pwCompare"
        />
      </div>

      <div v-if="warningTxt != ''" class="alert alert-warning" warning="alert">
        {{ warningTxt }}
      </div>

      <button
        type="submit"
        class="btn btn-primary"
        :disabled="newPassword != newPasswordRepeated || isLoggedInUser()"
        @click="changePassword"
      >
        Passwort Ändern
      </button>
    </div>
  </VueFinalModal>
</template>

<script lang="ts">
import { Component, Prop, mixins } from "vue-facing-decorator";
import { User } from "../../types";
import { userStore } from "../../stores/rootStore";
import { UserClient } from "../../clients/UserClient";
import { cloneDeep } from "lodash";
import { VueFinalModal } from "vue-final-modal";
import { getErrorMessage } from "../../utils/errors";
import ToastMixin from "../../mixins/ToastMixin.vue";

@Component({
  components: {
    VueFinalModal,
  },
})
export default class UserEditor extends mixins(ToastMixin) {
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

    this.userClient
      .updateUser({
        id: this.user.id,
        roles: roles,
      })
      .then(() => {
        this.user.roles = roles;
      })
      .catch((e) => {
        const errorMessage = getErrorMessage(e);
        this.showToast.error(`Fehler beim Ändern der Rollen: ${errorMessage}`);
      });
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
    if (!this.user.id) {
      throw new Error("Keine Benutzer ID gesetzt");
    }
    this.userClient.changePassword(this.user.id, this.newPassword).then(() => {
      this.$emit("userEdited");
    });
  }
}
</script>
