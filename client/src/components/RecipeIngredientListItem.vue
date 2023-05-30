<template>
  <li>
    {{ quantity }} {{ ingredient.unit }}
    <router-link
      :to="{
        path: '/recipes',
        query: { ingredients: getIngredientId(ingredient) },
      }"
    >
      {{ getIngredientName(ingredient) }}
    </router-link>
    <span class="ms-2">
      <Icon v-if="isSeasonal(ingredient.ingredient)" icon="calendarWeek" />
    </span>
  </li>
</template>

<script lang="ts">
import { round } from "lodash";
import { Vue, Component, Prop, Watch } from "vue-facing-decorator";
import { Ingredient, RecipeIngredient } from "../types";
import { Icon } from "@iconify/vue/dist/offline";
import RecipeCard from "./cards/RecipeCard.vue";

const currentMonth = new Date().getMonth() + 1;

@Component({
  components: { RecipeCard, Icon },
})
export default class RecipeIngredientListItem extends Vue {
  @Prop({ required: true }) ingredient!: RecipeIngredient;
  @Prop({ required: true }) quantityFactor!: number;

  numericQuantity: number | null = null;
  quantity: number | string = "";

  mounted() {
    if (this.ingredient.quantity) {
      const nmbr = Number(this.ingredient.quantity);
      if (!isNaN(nmbr)) {
        this.numericQuantity = nmbr;
      }
    }
    this.setQuantity();
  }

  @Watch("quantityFactor")
  setQuantity(): void {
    if (this.numericQuantity) {
      this.quantity = round(this.numericQuantity * this.quantityFactor, 2);
    } else if (this.ingredient.quantity) {
      this.quantity = this.ingredient.quantity;
    } else {
      this.quantity = "";
    }
  }

  getIngredientId(ingredient: RecipeIngredient): number | undefined {
    return ingredient.ingredient?.ingredientId;
  }

  getIngredientName(ingredient: RecipeIngredient): string | undefined {
    return ingredient.ingredient?.name;
  }

  isSeasonal(ingredient?: Ingredient | null): boolean {
    if (ingredient && ingredient.seasonStart && ingredient.seasonEnd) {
      if (ingredient.seasonStart <= ingredient.seasonEnd) {
        return (
          currentMonth >= ingredient.seasonStart &&
          currentMonth <= ingredient.seasonEnd
        );
      } else if (ingredient.seasonStart > ingredient.seasonEnd) {
        return (
          currentMonth >= ingredient.seasonEnd ||
          currentMonth <= ingredient.seasonStart
        );
      }
    }
    return false;
  }
}
</script>
