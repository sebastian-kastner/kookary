<template>
  <div class="recipe-overview">
    <br />
    <form>
      <div class="form-row">
        <div class="col">
          <input
            type="text"
            class="form-control"
            placeholder="Name"
            v-model="nameFilter"
          />
        </div>
        <div class="col">
          <div v-if="ingredientFilter !== null" class="ingredient-filter">
            {{ ingredientFilter.name }}
            <p v-on:click="deleteIngredientFilter" class="ingredient-filter-delete">x</p>
          </div>
          <typeahead-input
            v-else
            :items="existingIngredients"
            :itemProjection="getIngredientLabel"
            @selectItem="setIngredient"
          />
        </div>
        <div class="col">
          <button
            type="button"
            class="btn btn-primary"
            v-on:click="applyFilter"
          >
            Filter
          </button>
        </div>
      </div>
    </form>
    <br />
    <recipe-list :recipes="recipes" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RecipesClient, RecipeFilter } from "../clients/RecipesClient";
import { Ingredient, Recipe } from "../types";
import RecipeList from "../components/RecipeList.vue";
import TypeaheadInput from "../components/TypeaheadInput.vue";
import { ingredientStore } from "../stores/rootStore";

@Component({
  components: { RecipeList, TypeaheadInput },
})
export default class RecipesView extends Vue {
  recipes: Recipe[] = [];
  nameFilter = "";
  ingredientFilter: Ingredient | null = null;
  recipeClient = new RecipesClient();

  mounted(): void {
    this.recipeClient.getRecipes().then((ret) => {
      this.recipes = ret;
    });
  }

  public async applyFilter(): Promise<void> {
    const filter: RecipeFilter = {};
    if (this.nameFilter != "") {
      filter.nameContains = this.nameFilter;
    }
    if (this.ingredientFilter) {
      filter.withIngredient = this.ingredientFilter.ingredientId;
    }
    this.recipeClient.getRecipes(filter).then((ret) => {
      console.log(ret);
      this.recipes = ret;
    });
  }

  get existingIngredients(): Ingredient[] {
    return ingredientStore.ingredients;
  }

  setIngredient(ingredient: Ingredient): void {
    this.ingredientFilter = ingredient;
    this.$emit("onNameChanged");
  }

  getIngredientLabel(ingredient: Ingredient | undefined): string {
    if (ingredient && ingredient.name) {
      return ingredient.name;
    }
    return "";
  }

  deleteIngredientFilter(): void {
    this.ingredientFilter = null;
  }
}
</script>

<style lang="scss">
.recipe-overview {
  display: inline-block;

  .ingredient-filter {
    background-color: #17a2b8;
    border-color: #17a2b8;
    line-height: 2.3;
    border-radius: 0.25rem;
    color: white;
    padding-left: 10px;
    padding-right: 10px;
    margin-right: 10px;
    margin-bottom: 5px;
  }

  .ingredient-filter-delete {
    padding-left: 5px;
    margin-top: 0;
    padding-right: 2px;
    margin-bottom: 0;
    display: inline-block;
  }
  
  .ingredient-filter-delete:hover {
    color: gray;
  }
}
</style>
