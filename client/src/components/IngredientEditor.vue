<template>
  <div class="form-group">
    <div class="row g-3">
      <div class="col-sm-6">
        <typeahead-input
          :data="existingIngredients"
          :value="getIngredientLabel(ingredient.ingredient)"
          :isDisabled="ingredientSelected"
          :labelProvider="getIngredientLabel"
          :idProvider="getIngredientId"
          :addNewHandler="addNewIngredient"
          @onSuggestionSelected="setIngredient"
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
        <button type="button" class="btn btn-light" v-if="ingredientSelected" v-on:click="removeIngredient">X</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { RecipeIngredient, Ingredient } from "../types";
import { IngredientsClient } from "../clients/IngredientsClient"
import TypeaheadInput from "./TypeaheadInput.vue";

@Component({
  components: { TypeaheadInput },
})
export default class IngredientEditor extends Vue {
  @Prop({ required: true }) ingredient!: RecipeIngredient;
  @Prop({ required: true }) existingIngredients!: Ingredient[];

  ingredientSelected = false;
  ingredientsClient = new IngredientsClient();

  mounted(): void {
    if(this.ingredient && this.ingredient.ingredient && this.ingredient.ingredient.ingredientId) {
      this.ingredientSelected = true;
    }
  }

  setIngredient(ingredient: Ingredient): void {
    this.ingredient.ingredient = ingredient;
    this.ingredientSelected = true;
    this.$emit("onNameChanged");
  }

  getIngredientLabel(ingredient: Ingredient | undefined): string {
    if(ingredient && ingredient.name) {
      return ingredient.name;
    }
    return ''
  }

  getIngredientId(ingredient: Ingredient | undefined): string | null {
    if(ingredient && ingredient.ingredientId) {
      return ingredient.ingredientId.toString();
    }
    return null;
  }

  removeIngredient(): void {
    this.$emit("onDelete", this.ingredient);
  }

  async addNewIngredient(ingredientName: string): Promise<void> {
    this.ingredientsClient.createIngredient(ingredientName).then((ingredient) => {
      this.setIngredient(ingredient);
    }).catch((reason) => {
      console.error("Failed to create ingredient", ingredientName, reason);
    });
  }
}
</script>
