<template>
  <div class="about">
    <form>
      <div class="form-group">
        <label for="recipe-name">Rezeptname</label>
        <input
          autocomplete="off"
          class="form-control"
          id="recipe-name"
          placeholder="Rezeptname"
          v-model="recipe.name"
        />
      </div>
      <div class="form-group">
        <label>Zutaten</label>
        <div
          v-for="ingredient in recipe.recipeIngredients"
          v-bind="ingredient"
          v-bind:key="ingredient.ingredientId"
        >
          <ingredient-editor 
            :ingredient="ingredient"
            :existingIngredients="availableIngredients"
            @onNameChanged="updateName"
            />
        </div>
      </div>
      <button type="submit" class="btn btn-primary" v-on:click="doSubmit">Submit</button>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Ingredient, Recipe } from '../types'
import { IngredientsClient } from '../clients/IngredientsClient'
import IngredientEditor from '../components/IngredientEditor.vue'

@Component({
  components: { IngredientEditor }
})
export default class AddRecipeView extends Vue {
  recipe: Recipe = {};
  availableIngredients: Ingredient[] = [];
  ingredientsClient: IngredientsClient = new IngredientsClient();

  mounted (): void {
    this.recipe = {
      recipeIngredients: [{}]
    }
    
    this.ingredientsClient.getIngredients().then((ingredients) => {
      this.availableIngredients = ingredients
    })
  }

  updateName(foo: object): void {
    console.log(foo);
    this.recipe.recipeIngredients?.push({});
  }

  doSubmit(): void {
    console.log(this.recipe);
    console.log(this.recipe.recipeIngredients);
  }
}
</script>
