<template>
  <div class="row">
    <div class="col-8">
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="isMarked"
          id="marked"
          v-on:change="setIsMarked(true)"
          :checked="internalValue === true"
        />
        <label class="form-check-label" for="marked">
          Auf Merkliste
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="isMarked"
          id="notMarked"
          v-on:change="setIsMarked(false)"
          :checked="internalValue === false"
        />
        <label class="form-check-label" for="notMarked">
          Nicht auf Merkliste
        </label>
      </div>
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
export default class IsMarkedFilterComponent extends Vue {
  @Prop({ required: true }) recipeFilter!: RecipeFilter;

  internalValue: boolean | null = null;

  mounted(): void {
      this.internalValue = this.recipeFilter.marked;
  }

  applyFilter(): void {
    this.$emit("applyFilter");
  }

  setIsMarked(isMarked: boolean) {
    this.recipeFilter.marked = isMarked;
    this.$emit("applyFilter");
  }
}
</script>
