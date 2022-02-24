<template>
  <div class="about">
    <div class="form-group">
      <label for="recipe-name">Rezeptname</label>
      <input
        autocomplete="off"
        class="form-control"
        :class="(doValidate && !hasValidName) ? 'is-invalid' : ''"
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
    <div class="form-group">
      <label>Beschreibung</label>
      <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" v-bind="recipe.description" />  
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
  doValidate = false;

  mounted(): void {
    this.recipe = {
      recipeIngredients: [{}],
    };

    this.ingredientsClient.getIngredients().then((ingredients) => {
      this.availableIngredients = ingredients;
    });
  }

  get hasValidName(): boolean {
    if(this.recipe.name && this.recipe.name.length > 2) {
      return true;
    }
    return false;
  }

  updateName(): void {
    if(this.recipe.recipeIngredients) {
      if(this.recipe.recipeIngredients[this.recipe.recipeIngredients.length - 1].ingredient?.name) {
        this.recipe.recipeIngredients?.push({});
      }
    }
  }

  doSubmit(): void {
    if(!this.hasValidName) {
      this.doValidate = true;
    } else {
      // do something
      console.log(this.recipe);
    }
  }
}
</script>
