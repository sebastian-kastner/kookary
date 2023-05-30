<template>
  <div id="ingredient-editor" class="form-group">
    <div class="form-row">
      <div
        class="col-1 d-flex align-items-center justify-content-center"
        :class="handleClass"
      >
        <Icon icon="arrowDownUp" />
      </div>
      <div class="col-5">
        <input
          v-if="ingredient.ingredient && ingredient.ingredient.ingredientId"
          v-model="ingredient.ingredient.name"
          class="form-control simple-typeahead-input"
          type="text"
          disabled="true"
        />
        <typeahead-input
          v-else
          :items="existingIngredients"
          :value="getIngredientLabel(ingredient.ingredient)"
          :item-projection="getIngredientLabel"
          :add-new-handler="addNewIngredient"
          @selectItem="setIngredient"
        />
      </div>
      <div class="col-3">
        <input
          v-model="ingredient.quantity"
          type="text"
          class="form-control"
          placeholder="Menge"
        />
      </div>
      <div class="col-2">
        <input
          v-model="ingredient.unit"
          type="text"
          class="form-control"
          placeholder="Einheit"
        />
      </div>

      <div
        v-if="ingredientSelected"
        class="col-1 d-flex align-items-center justify-content-center delete-ingredient-col"
        @click="removeIngredient"
      >
        <Icon icon="trash" />
      </div>
      <div v-else class="col-1" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, mixins } from "vue-facing-decorator";
import { RecipeIngredient, Ingredient } from "../types";
import ToastMixin from "../mixins/ToastMixin.vue";
import TypeaheadInput from "./TypeaheadInput.vue";
import { ingredientStore } from "../stores/rootStore";
import { getErrorMessage } from "../utils/errors";
import { Icon } from "@iconify/vue/dist/offline";

@Component({
  components: { TypeaheadInput, Icon },
})
export default class RecipeIngredientEditor extends mixins(ToastMixin) {
  @Prop({ required: true }) ingredient!: RecipeIngredient;
  @Prop({ required: true }) existingIngredients!: Ingredient[];
  @Prop({ required: true }) handleClass!: string;

  ingredientSelected = false;

  mounted(): void {
    if (
      this.ingredient &&
      this.ingredient.ingredient &&
      this.ingredient.ingredient.ingredientId
    ) {
      this.ingredientSelected = true;
    }
  }

  setIngredient(ingredient: Ingredient): void {
    this.ingredient.ingredient = ingredient;
    this.ingredientSelected = true;
    this.$emit("onNameChanged");
  }

  getIngredientLabel(ingredient: Ingredient | null | undefined): string {
    if (ingredient && ingredient.name) {
      return ingredient.name;
    }
    return "";
  }

  removeIngredient(): void {
    this.$emit("onDelete", this.ingredient);
  }

  async addNewIngredient(ingredientName: string): Promise<void> {
    ingredientStore
      .addIngredient(ingredientName)
      .then((ingredient) => {
        this.setIngredient(ingredient);
      })
      .catch((error) => {
        console.error(error);
        const errorMessage = getErrorMessage(error);
        this.showToast.error(
          `Fehler beim Anlegen der Zutat ${ingredientName}: ${errorMessage}`
        );
      });
  }
}
</script>

<style lang="scss">
@import "../styles/variables.scss";

#ingredient-editor {
  .rounded-button {
    font-size: 13px;
    padding: 3px 8px 3px 9px;
    border-radius: 40px;
  }

  input:disabled {
    background-color: $background-color-highlight-1;
  }

  .delete-ingredient-col {
    svg {
      font-size: 1.5rem;
    }
  }
}
</style>
