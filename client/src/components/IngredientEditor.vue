<template>
  <div id="ingredient-editor" class="form-group">
    <div class="row g-3">
      <div class="col-sm-6">
        <input
          v-if="ingredient.ingredient && ingredient.ingredient.ingredientId"
          class="form-control simple-typeahead-input"
          type="text"
          v-model="ingredient.ingredient.name"
          disabled="true"
        />
        <typeahead-input
          v-else
          :items="existingIngredients"
          :value="getIngredientLabel(ingredient.ingredient)"
          :itemProjection="getIngredientLabel"
          :addNewHandler="addNewIngredient"
          @selectItem="setIngredient"
        />
      </div>
      <div class="col-sm">
        <input
          type="text"
          class="form-control"
          placeholder="Menge"
          v-model="ingredient.quantity"
        />
      </div>
      <div class="col-sm">
        <input
          type="text"
          class="form-control"
          placeholder="Einheit"
          v-model="ingredient.unit"
        />
      </div>
      <div class="col-sm">
        <button
          type="button"
          class="btn rounded-button"
          v-if="ingredientSelected"
          v-on:click="removeIngredient"
        >
          X
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { RecipeIngredient, Ingredient } from "../types";
import TypeaheadInput from "./TypeaheadInput.vue";
import { ingredientStore } from "../stores/rootStore"

@Component({
  components: { TypeaheadInput },
})
export default class IngredientEditor extends Vue {
  @Prop({ required: true }) ingredient!: RecipeIngredient;
  @Prop({ required: true }) existingIngredients!: Ingredient[];

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

  getIngredientLabel(ingredient: Ingredient | undefined): string {
    if (ingredient && ingredient.name) {
      return ingredient.name;
    }
    return "";
  }

  removeIngredient(): void {
    this.$emit("onDelete", this.ingredient);
  }

  async addNewIngredient(ingredientName: string): Promise<void> {
    ingredientStore.addIngredient(ingredientName)
      .then((ingredient) => {
        this.setIngredient(ingredient);
      })
      .catch((reason) => {
        console.error("Failed to create ingredient", ingredientName, reason);
      });
  }
}
</script>

<style lang="scss">
@import "../../main.scss";

#ingredient-editor {
  .rounded-button {
    font-size: 13px;
    padding: 3px 8px 3px 9px;
    border-radius: 40px;
  }

  input:disabled {
    background-color: $background-color-highlight-1;
  }
}

</style>