<template>
  <div class="about">
    <form>
      <div class="form-group">
        <label for="recipe-name">Rezeptname</label>
        <input
          type="email"
          class="form-control"
          id="recipe-name"
          placeholder="Rezeptname"
        />
      </div>
      <div class="form-group">
        <label>Zutaten</label>
        <div
          v-for="ingredient in ingredients"
          v-bind:key="ingredient.ingredientId"
        >
          <ingredient-editor />
        </div>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { RecipeIngredient, Ingredient } from '../types'
import { IngredientsClient } from '../clients/IngredientsClient'
import IngredientEditor from '../components/IngredientEditor.vue'

@Component({
  components: { IngredientEditor }
})
export default class AddRecipeView extends Vue {
  ingredients: RecipeIngredient[] = [];
  availableIngredients: Ingredient[] = [];
  ingredientsClient: IngredientsClient = new IngredientsClient();

  mounted (): void {
    this.ingredients.push({})

    this.ingredientsClient.getIngredients().then((ingredients) => {
      this.availableIngredients = ingredients
    })
  }
}
</script>
