<template>
  <tr>
    <td class="align-middle d-none d-ml-table-cell">
      {{ getUserName(ingredient.authorId) }}
    </td>
    <td>
      <input
        type="text"
        class="form-control"
        v-model="ingredient.name"
        v-on:focusout="updateIngredient"
        @keydown.enter="updateIngredient"
      />
    </td>
    <td>
      <select
        name="category"
        class="form-control"
        v-model="ingredient.ingredientCategoryId"
        v-on:change="updateIngredient"
      >
        <option
          v-for="category in categories"
          v-bind:key="category.ingredientCategoryId"
          :value="category.ingredientCategoryId"
        >
          {{ category.name }}
        </option>
      </select>
    </td>
    <td class="d-none d-sm-table-cell">
      <select
        name="seasonStart"
        class="form-control"
        v-model="ingredient.seasonStart"
        v-on:change="updateIngredient"
      >
        <option value="">-</option>
        <option v-for="i in monthIndexes" v-bind:key="i" :value="i">
          {{ getMonthName(i) }}
        </option>
      </select>
    </td>
    <td class="d-none d-sm-table-cell">
      <select
        name="seasonEnd"
        class="form-control"
        v-model="ingredient.seasonEnd"
        v-on:change="updateIngredient"
      >
        <option value="">-</option>
        <option v-for="i in monthIndexes" v-bind:key="i" :value="i">
          {{ getMonthName(i) }}
        </option>
      </select>
    </td>
    <td class="align-middle">
      <div @click="removeIngredient(ingredient)">
        <b-icon-trash />
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
import { Prop, Vue, Component } from "vue-facing-decorator";
import { Ingredient, IngredientCategory } from "../../types";
import { userStore, ingredientCategoryStore } from "../../stores/rootStore";
import { IngredientsClient } from "../../clients/IngredientsClient";

const MONTHS = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];
const MONTH_INDEXES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

@Component({
  components: {},
})
export default class IngredientEditor extends Vue {
  @Prop({ required: true })
  ingredient!: Ingredient;

  ingredientsClient = new IngredientsClient();

  get categories(): IngredientCategory[] {
    return ingredientCategoryStore.categories;
  }

  get monthIndexes(): number[] {
    return MONTH_INDEXES;
  }

  updateIngredient(): void {
    this.ingredientsClient.updateIngredient(this.ingredient);
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

  removeIngredient(ingredient: Ingredient): void {
    this.$emit("onIngredientDelete", ingredient);
  }
}
</script>
