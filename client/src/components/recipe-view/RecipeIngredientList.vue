<template>
  <div v-for="(headline, index) in ingredientHeadlines" :key="index">
    <h5 v-if="headline.label" class="mt-3">{{ headline.label }}</h5>
    <recipe-ingredient-list-item
      v-for="ingredient in headline.ingredients"
      :key="ingredient.uuid"
      :ingredient="ingredient"
      :quantity-factor="quantityFactor"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-facing-decorator";
import { RecipeIngredient } from "../../types";
import RecipeIngredientListItem from "./RecipeIngredientListItem.vue";

type IngredientHeadline = {
  label: string | null;
  ingredients: RecipeIngredient[];
};

@Component({
  components: { RecipeIngredientListItem },
})
export default class RecipeIngredientList extends Vue {
  @Prop({ required: true }) ingredients!: RecipeIngredient[];
  @Prop({ required: true }) quantityFactor!: number;

  get ingredientHeadlines(): IngredientHeadline[] {
    const ingredientHeadlines: IngredientHeadline[] = [];

    let lastHeadline: IngredientHeadline = {
      label: null,
      ingredients: [],
    };
    ingredientHeadlines.push(lastHeadline);

    this.ingredients.forEach((ingredient) => {
      // add new headline
      if (ingredient.separatorLabel && ingredient.separatorLabel !== "") {
        lastHeadline = {
          label: ingredient.separatorLabel,
          ingredients: [],
        };
        ingredientHeadlines.push(lastHeadline);
      } else {
        lastHeadline.ingredients.push(ingredient);
      }
    });
    return ingredientHeadlines;
  }
}
</script>
