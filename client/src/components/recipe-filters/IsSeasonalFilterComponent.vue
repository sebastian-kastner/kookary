<template>
  <div class="row">
    <div class="col-12">
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="isSeasonal"
          id="seasonal"
          v-on:change="setIsSeasonal(true)"
          :checked="recipeFilter.isSeasonal === true"
        />
        <label class="form-check-label" for="seasonal"> Saisonal </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="isSeasonal"
          id="notSeasonal"
          v-on:change="setIsSeasonal(false)"
          :checked="recipeFilter.isSeasonal === false"
        />
        <label class="form-check-label" for="notSeasonal">
          Nicht saisonal
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { RecipeFilter } from "../../clients/RecipesClient";
import { Prop } from "vue-facing-decorator";
import { Options, Vue } from "vue-class-component";

@Options({})
export default class IsSeasonalFilterComponent extends Vue {
  @Prop({ required: true }) recipeFilter!: RecipeFilter;

  applyFilter(): void {
    this.$emit("applyFilter");
  }

  setIsSeasonal(isSeasonal: boolean) {
    this.recipeFilter.isSeasonal = isSeasonal;
    this.$emit("applyFilter");
  }
}
</script>
