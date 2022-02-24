<template>
  <div class="about">
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
        v-for="(ingredient, index) in recipe.recipeIngredients"
        v-bind="ingredient"
        v-bind:key="index.toString().concat(ingredient.ingredientId)"
      >
        <ingredient-editor
          :ingredient="ingredient"
          :existingIngredients="availableIngredients"
          @onNameChanged="updateName"
        />
      </div>
    </div>
    <button class="btn btn-primary" v-on:click="doSubmit">Submit</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Ingredient, Recipe } from "../types";
import { IngredientsClient } from "../clients/IngredientsClient";
import IngredientEditor from "../components/IngredientEditor.vue";

@Component({
  components: { IngredientEditor },
})
export default class AddRecipeView extends Vue {
  recipe: Recipe = {};
  availableIngredients: Ingredient[] = [];
  ingredientsClient: IngredientsClient = new IngredientsClient();

  mounted(): void {
    this.recipe = {
      recipeIngredients: [{}],
    };

    this.ingredientsClient.getIngredients().then((ingredients) => {
      this.availableIngredients = ingredients;
    });
  }

  updateName(): void {
    if(this.recipe.recipeIngredients) {
      console.log("ingredients found");
      console.log("last ingredient name", this.recipe.recipeIngredients[this.recipe.recipeIngredients.length - 1].ingredient?.name)
      if(this.recipe.recipeIngredients[this.recipe.recipeIngredients.length - 1].ingredient?.name) {
        this.recipe.recipeIngredients?.push({});
      }
    }
  }

  doSubmit(): void {
    // do something
    console.log(this.recipe)
  }
}
</script>
