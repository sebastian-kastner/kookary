<template>
  <div id="user-mgt" class="container main-content padding-top">
    <h3>Zutaten</h3>
    <table class="table">
      <thead>
        <tr>
          <th scope="col" class="d-none d-ml-table-cell">Author</th>
          <th scope="col">Name</th>
          <th scope="col">Category</th>
          <th scope="col" class="d-none d-sm-table-cell">Saison von</th>
          <th scope="col" class="d-none d-sm-table-cell">Saison bis</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="d-none d-ml-table-cell">
            <select name="author" class="form-control" v-model="filter.authorId" v-on:change="applyFilter">
              <option value="-1">-</option>
              <option v-for="user in users" v-bind:key="user.id" :value="user.id">{{ user.displayName }}</option>
            </select>
          </td>
          <td><input type="text" class="form-control" v-model="filter.ingredientName" v-on:focusout="applyFilter"
              @keydown.enter="applyFilter" /></td>
          <td>
            <select name="category" class="form-control" v-model="filter.categoryId" v-on:change="applyFilter">
              <option value="-1">-</option>
              <option value="0">Unkategorisiert</option>
              <option v-for="category in categories" v-bind:key="category.ingredientCategoryId"
                :value="category.ingredientCategoryId">{{ category.name }}</option>
            </select>
          </td>
          <td colspan="2" class="d-none d-sm-table-cell">
            <select name="seasonal" class="form-control" v-model="filter.seasonal" v-on:change="applyFilter">
              <option value="">-</option>
              <option value="seasonal">Saisonal</option>
              <option value="nonseasonal">Nicht Saisonal</option>
            </select>
          </td>
          <td></td>
        </tr>

        <ingredient-editor v-for="ingredient in ingredients" 
          v-bind:key="ingredient.ingredientId" 
          :ingredient="ingredient"
          @onIngredientDelete="removeIngredient"
        />

      </tbody>
    </table>

  </div>
</template>

<script lang="ts">
import { Ingredient, User, IngredientCategory } from "../../types";
import { Component, Vue } from "vue-property-decorator";
import { ingredientStore, userStore, ingredientCategoryStore } from "../../stores/rootStore";
import IngredientEditor from '../../components/admin/IngredientEditor.vue';

type IngredientFilter = {
  ingredientName: string | null;
  authorId: string;
  categoryId: string;
  seasonal: string;
}

@Component({
  components: {
    IngredientEditor
  },
})
export default class IngredientMgmtView extends Vue {
  ingredients: Ingredient[] = [];

  filter: IngredientFilter = {
    ingredientName: null,
    authorId: "-1",
    categoryId: "0",
    seasonal: "",
  }

  mounted(): void {
    this.ingredients = [...ingredientStore.ingredients];
    this.applyFilter();
  }

  get users(): User[] {
    return userStore.users;
  }

  get categories(): IngredientCategory[] {
    return ingredientCategoryStore.categories;
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
      if (!isNaN(tmpNmbr)) {
        categoryId = tmpNmbr;
      }
    }

    let authorId = -1;
    if (this.filter.authorId) {
      const tmpNmbr = parseInt(this.filter.authorId);
      if (!isNaN(tmpNmbr)) {
        authorId = tmpNmbr;
      }
    }

    let seasonal: null | boolean = null;
    if (this.filter.seasonal === "seasonal") {
      seasonal = true;
    } else if (this.filter.seasonal === "nonseasonal") {
      seasonal = false;
    }

    ingredientStore.ingredients.forEach(ingredient => {
      if (this.appliesToFilter(ingredient, ingredientName, categoryId, authorId, seasonal)) {
        filteredIngredients.push(ingredient);
      }
    });
    this.ingredients = filteredIngredients;
  }

  removeIngredient(ingredient: Ingredient): void {
    this.$modal.show('dialog', {
      title: "Zutat löschen",
      text: "Soll die Zutat " + ingredient.name + " wirklich gelöscht werden?",
      buttons: [
        {
          title: 'Abbrechen',
          handler: () => {
            this.$modal.hide('dialog')
          }
        },
        {
          title: 'Löschen',
          handler: () => {
            if (ingredient.ingredientId) {
              ingredientStore.removeIngredient(ingredient.ingredientId)
                .then(() => {
                  // remove ingredient from view
                  this.ingredients.splice(this.ingredients.indexOf(ingredient), 1);
                })
                .catch((err) => {
                  // TODO improve error handling
                  console.error(err);
                })
            }
            this.$modal.hide('dialog');
          }
        }
      ]
    });
  }

  private appliesToFilter(ingredient: Ingredient, ingredientName: null | string, categoryId: number, authorId: number, seasonal: null | boolean) {
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
    if (seasonal !== null) {
      if (seasonal && (!ingredient.seasonStart || !ingredient.seasonEnd)) {
        return false;
      }
      if (!seasonal && (ingredient.seasonStart || ingredient.seasonEnd)) {
        return false;
      }
    }
    return true;
  }
}
</script>

<style lang="scss">
@import "../../../main.scss";

</style>