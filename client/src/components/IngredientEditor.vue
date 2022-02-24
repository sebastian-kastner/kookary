<template>
  <div class="form-group">
    <div class="row g-3">
      <div class="col-sm-7">
        <typeahead-input
          :data="existingIngredients"
          :value="ingredient.name"
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
          v-model="ingredient.amount"
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

  ingredientsClient = new IngredientsClient();

  setIngredient(ingredient: Ingredient): void {
    this.ingredient.ingredient = ingredient;
    this.$emit("onNameChanged");
  }

  getIngredientLabel(ingredient: Ingredient): string {
    if(ingredient.name) {
      return ingredient.name;
    }
    return ''
  }

  getIngredientId(ingredient: Ingredient): string {
    if(ingredient.ingredientId) {
      return ingredient.ingredientId.toString();
    }
    return ''
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
