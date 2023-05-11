<template>
  <div id="calendar" class="main-content container">
    <div class="form-row">
      <div class="form-group col">
        <label for="monthPicker"> Monat </label>
        <select
          id="monthPicker"
          name="category"
          class="form-control"
          v-model="selectedMonth"
          v-on:change="updateMonth"
        >
          <option
            v-for="(month, monthIndex) in monthNames"
            v-bind:key="month"
            :value="monthIndex"
          >
            {{ month }}
          </option>
        </select>
      </div>
      <div class="form-group col">
        <label for="nameFilter"> Suche </label>
        <input
          id="nameFilter"
          type="text"
          class="form-control"
          v-model="nameFilter"
          v-on:focusout="updateNameFilter"
          @keydown.enter="updateNameFilter"
          placeholder="Zutatenname"
        />
      </div>
    </div>
    <div class="container">
      <div
        v-for="ingredient in ingredients"
        v-bind:key="ingredient.ingredientId"
        class="seasonal-ingredient"
      >
        <div class="ingredient-title">
          <router-link
            :to="{
              path: '/recipes',
              query: { ingredients: ingredient.ingredientId },
            }"
          >
            {{ ingredient.name }}
          </router-link>
        </div>
        <div>
          {{ getMonthName(ingredient.seasonStart) }} -
          {{ getMonthName(ingredient.seasonEnd) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Ingredient } from "../types";
import { Options, Vue } from "vue-class-component";
import { ingredientStore } from "../stores/rootStore";

@Options({
  components: {},
})
export default class Calendar extends Vue {
  monthNames = [
    "--",
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

  selectedMonth = new Date().getMonth() + 1;
  nameFilter = "";

  get allSeasonalIngredients(): Ingredient[] {
    const allSeasonalIngredients = ingredientStore.ingredients.filter(
      (ingredient) => {
        return ingredient.seasonStart && ingredient.seasonEnd;
      }
    );
    return allSeasonalIngredients.sort((a, b) => {
      if (a.seasonStart && b.seasonStart) {
        return a.seasonStart - b.seasonStart;
      }
      return 0;
    });
  }

  get ingredients(): Ingredient[] {
    return this.allSeasonalIngredients.filter((ingredient) => {
      // if a name filter is set and no ingredient name is set, exclude
      if (this.nameFilter && !ingredient.name) {
        return false;
      }

      // handle name filter
      if (this.nameFilter !== "") {
        // if no ingredient name is given, exclude
        if (!ingredient.name) {
          return false;
        }
        // exclude if the ingredient name does not match the filter
        if (
          !ingredient.name.toLowerCase().includes(this.nameFilter.toLowerCase())
        ) {
          return false;
        }
      }

      // if not month filter is set, always return true here
      if (this.selectedMonth === 0) {
        return true;
      }

      let inSeason = false;
      if (ingredient.seasonStart && ingredient.seasonEnd) {
        const start = ingredient.seasonStart;
        const end = ingredient.seasonEnd;
        const month = this.selectedMonth;
        if (start < end) {
          inSeason = start <= month && end >= month;
        } else if (start > end) {
          inSeason = month >= start || month <= end;
        }
      }

      return inSeason;
    });
  }

  updateMonth(): void {
    console.log("month is now", this.selectedMonth);
  }

  updateNameFilter(): void {
    console.log("name filter is now", this.nameFilter);
  }

  getMonthName(index: number | null | undefined): string {
    if (index && index >= 1 && index <= 12) {
      return this.monthNames[index];
    }
    return "-";
  }
}
</script>

<style lang="scss" scoped>
@import "../../main.scss";

#calendar {
  padding-top: $content-padding;

  .seasonal-ingredient {
    padding: $content-padding $content-padding * 2 $content-padding
      $content-padding * 2;
    margin: $content-padding;
    border: 1px solid $button-color-secondary;
    border-radius: 10px;
    box-shadow: 2px 2px 2px darken($background-color-highlight-1, 8);

    .ingredient-title {
      font-weight: bold;
      a {
        color: $font-color-highlight;
        text-decoration: underline;
      }
    }
  }
}
</style>
