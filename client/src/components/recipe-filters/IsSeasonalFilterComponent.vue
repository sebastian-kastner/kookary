<template>
  <div class="row">
    <div class="col-8">
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="isSeasonal"
          id="seasonal"
          v-on:change="setIsSeasonal(true)"
          :checked="recipeFilter.isSeasonal === true"
        />
        <label class="form-check-label" for="seasonal">
          Saisonal
        </label>
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
    <div class="col text-center">
      <button type="button" class="btn btn-primary" v-on:click="applyFilter">
        &check;
      </button>
    </div>
    <div class="col text-center">
      <button type="button" class="btn btn-primary" v-on:click="resetFilter">
        &Cross;
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { RecipeFilter } from "../../clients/RecipesClient";
import { Vue, Component, Prop } from "vue-property-decorator";
import { BDropdown, BDropdownItem } from "bootstrap-vue";

@Component({
  components: { BDropdown, BDropdownItem },
})
export default class IsSeasonalFilterComponent extends Vue {
  @Prop({ required: true }) recipeFilter!: RecipeFilter;

  applyFilter(): void {
    this.$emit("applyFilter");
  }

  resetFilter(): void {
    this.recipeFilter.isSeasonal = false;
    this.$emit("applyFilter");
  }

  setIsSeasonal(isSeasonal: boolean) {
    this.recipeFilter.isSeasonal = isSeasonal;
  }
}
</script>
