<template>
  <tr>
    <td class="align-middle d-none d-ml-table-cell">
      {{ getUserName(ingredient.authorId) }}
    </td>
    <td>
      <input
        v-model="ingredient.name"
        type="text"
        class="form-control"
        @focusout="updateIngredient"
        @keydown.enter="updateIngredient"
      >
    </td>
    <td>
      <select
        v-model="ingredient.ingredientCategoryId"
        name="category"
        class="form-control"
        @change="updateIngredient"
      >
        <option
          v-for="category in categories"
          :key="category.ingredientCategoryId"
          :value="category.ingredientCategoryId"
        >
          {{ category.name }}
        </option>
      </select>
    </td>
    <td class="d-none d-sm-table-cell">
      <select
        v-model="ingredient.seasonStart"
        name="seasonStart"
        class="form-control"
        @change="updateIngredient"
      >
        <option value="">
          -
        </option>
        <option
          v-for="i in monthIndexes"
          :key="i"
          :value="i"
        >
          {{ getMonthName(i) }}
        </option>
      </select>
    </td>
    <td class="d-none d-sm-table-cell">
      <select
        v-model="ingredient.seasonEnd"
        name="seasonEnd"
        class="form-control"
        @change="updateIngredient"
      >
        <option value="">
          -
        </option>
        <option
          v-for="i in monthIndexes"
          :key="i"
          :value="i"
        >
          {{ getMonthName(i) }}
        </option>
      </select>
    </td>
    <td class="align-middle">
      <div @click="removeIngredient(ingredient)">
        <Icon icon="trash" />
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-facing-decorator";
import { Ingredient, IngredientCategory } from "../../types";
import { userStore, ingredientCategoryStore } from "../../stores/rootStore";
import { IngredientsClient } from "../../clients/IngredientsClient";
import { Icon } from '@iconify/vue/dist/offline';


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
  components: { Icon },
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
