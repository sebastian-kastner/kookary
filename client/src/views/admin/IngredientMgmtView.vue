<template>
  <div id="user-mgt" class="container main-content padding-top">
    <h3>Zutaten</h3>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Author</th>
          <th scope="col">Category</th>
          <th scope="col">Saison von</th>
          <th scope="col">Saison bis</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><input type="text" class="form-control" v-model="filter.ingredientName" v-on:focusout="applyFilter" @keydown.enter="applyFilter"/></td>
          <td>
            <select name="author" class="form-control" v-model="filter.authorId" v-on:change="applyFilter">
              <option value="-1">-</option>
              <option v-for="user in users" v-bind:key="user.id" :value="user.id">{{user.displayName}}</option>
            </select>
          </td>
          <td>
            <select name="category" class="form-control" v-model="filter.categoryId" v-on:change="applyFilter">
              <option value="-1">-</option>
              <option value="0">Unkategorisiert</option>
              <option v-for="category in categories" v-bind:key="category.ingredientCategoryId" :value="category.ingredientCategoryId" >{{category.name}}</option>
            </select>
          </td>
          <td colspan="2">
          </td>
        </tr>
        <tr v-for="ingredient in ingredients" v-bind:key="ingredient.ingredientId">
          <td>{{ ingredient.name }}</td>
          <td>{{ getUserName(ingredient.authorId) }}</td>
          <td>{{ getCategoryName(ingredient.ingredientCategoryId) }}</td>
          <td>{{ getMonthName(ingredient.seasonStart) }}</td>
          <td>{{ getMonthName(ingredient.seasonEnd) }}</td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script lang="ts">
import { Ingredient, User, IngredientCategory } from "../../types";
import { Component, Vue } from "vue-property-decorator";
import { IngredientsClient } from "../../clients/IngredientsClient";
import { ingredientStore, userStore, ingredientCategoryStore } from "../../stores/rootStore"

const MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"
]

type IngredientFilter = {
  ingredientName: string | null;
  authorId: string;
  categoryId: string;
}

@Component({})
export default class IngredientMgmtView extends Vue {
  private ingredientClient = new IngredientsClient();

  ingredients: Ingredient[] = [];

  filter: IngredientFilter = {
    ingredientName: null,
    authorId: "-1",
    categoryId: "-1",
  }

  mounted(): void {
    this.ingredients = [...ingredientStore.ingredients];
  }

  get users(): User[] {
    return userStore.users;
  }

  get categories(): IngredientCategory[] {
    return ingredientCategoryStore.categories;
  }

  getUserName(userId: number | undefined | null): string {
    if (userId) {
      const user = userStore.userMap.get(userId);
      if (user && user.displayName) {
        return user.displayName;
      }
    }
    return "Unbekannt";
  }

  getCategoryName(categoryId: number | undefined | null): string {
    if (!categoryId) {
      return "-";
    }
    const category = ingredientCategoryStore.categoriesMap.get(categoryId);
    if (category && category.name) {
      return category.name;
    }
    return "Unbekannt";
  }

  getMonthName(monthNr: number | undefined | null): string | null {
    if (monthNr && monthNr > 0 && monthNr <= 12) {
      return MONTHS[monthNr - 1];
    }
    return null;
  }

  applyFilter(): void {
    const filteredIngredients: Ingredient[] = [];
    
    let ingredientName: string | null = null;
    if (this.filter.ingredientName && this.filter.ingredientName !== "") {
      ingredientName = this.filter.ingredientName;
    }
    
    let categoryId = -1;
    if (this.filter.categoryId) {
      const tmpNmbr = parseInt(this.filter.categoryId);
      if(!isNaN(tmpNmbr)) {
        categoryId = tmpNmbr;
      }
    }

    let authorId = -1;
    if (this.filter.authorId) {
      const tmpNmbr = parseInt(this.filter.authorId);
      if(!isNaN(tmpNmbr)) {
        authorId = tmpNmbr;
      }
    }

    ingredientStore.ingredients.forEach(ingredient => {
      if (this.appliesToFilter(ingredient, ingredientName, categoryId, authorId)) {
        filteredIngredients.push(ingredient);
      }
    });
    this.ingredients = filteredIngredients;
  }

  private appliesToFilter(ingredient: Ingredient, ingredientName: null | string, categoryId: number, authorId: number) {
    if (ingredientName && ingredientName !== "" && !ingredient.name?.toLowerCase().includes(ingredientName.toLowerCase())) {
      return false;
    }
    if (categoryId > 0 && ingredient.ingredientCategoryId !== categoryId) {
      return false;
    }
    if (categoryId == 0 && ingredient.ingredientCategoryId && ingredient.ingredientCategoryId > 0) {
      return false;
    }
    if (authorId > 0 && ingredient.authorId !== authorId) {
      return false;
    }
    return true;
  }
}
</script>

<style lang="scss">
@import "../../../main.scss";
</style>
