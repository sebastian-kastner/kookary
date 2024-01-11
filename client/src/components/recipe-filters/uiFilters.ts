import { tagStore, ingredientStore } from "../../stores/rootStore";
import { RecipeFilter } from "../../clients/RecipesClient";
import { Tag, Ingredient } from "../../types";

import NameFilterComponent from "./NameFilterComponent.vue";
import TagFilterComponent from "./TagFilterComponent.vue";
import IsSeasonalFilterComponent from "./IsSeasonalFilterComponent.vue";
import IngredientFilterComponent from "./IngredientFilterComponent.vue";
import IsMarkedFilterComponent from "./IsMarkedFilterComponent.vue";

/*
 different filter types:
  - string filter (name)
  - boolean filter (isSeasonal, isMarked)
  - list filter (tags, ingredients)

 common operations:
  - apply filter from route (?)
  - update route with filter
  - get key (key within the route, probably with a prefix)
    alternative: "appliesTo(nameOfGetParam)"
*/

export type UiFilter = {
  name: string;
  icon: string;
  component: unknown;
  applyRouteFilter: (routeValue: string, filter: RecipeFilter) => void;
  isActive: (filter: RecipeFilter) => boolean;
  resetFilter: (filter: RecipeFilter) => void;
};

export const nameFilter: UiFilter = {
  name: "name",
  icon: "cursor",
  component: NameFilterComponent,
  applyRouteFilter: (val, filter) => {
    filter.nameContains = val;
  },
  isActive: (filter) => listHasElements(filter.nameContains),
  resetFilter: (filter) => (filter.nameContains = ""),
};

export const tagFilter: UiFilter = {
  name: "tags",
  icon: "tags",
  component: TagFilterComponent,
  applyRouteFilter: (val, filter) => {
    filter.tags = getTags(val.split(";"));
  },
  isActive: (filter) => listHasElements(filter.tags),
  resetFilter: (filter) => (filter.tags = []),
};

export const ingredientFilter: UiFilter = {
  name: "ingredients",
  icon: "bag",
  component: IngredientFilterComponent,
  applyRouteFilter: (val, filter) => {
    filter.ingredients = getIngredients(val.split(";"));
  },
  isActive: (filter) => listHasElements(filter.ingredients),
  resetFilter: (filter) => (filter.ingredients = []),
};

export const seasonalFilter: UiFilter = {
  name: "seasonal",
  icon: "calendarWeek",
  component: IsSeasonalFilterComponent,
  applyRouteFilter: (val, filter) => {
    filter.isSeasonal = true;
  },
  isActive: (filter) => filter.isSeasonal === true,
  resetFilter: (filter) => (filter.isSeasonal = false),
};

export const markedFilter: UiFilter = {
  name: "marked",
  icon: "bell",
  component: IsMarkedFilterComponent,
  applyRouteFilter: (val, filter) => {
    filter.marked = true;
  },
  isActive: (filter) => filter.marked === true,
  resetFilter: (filter) => (filter.marked = false),
};

function listHasElements(list: Array<object> | string | undefined): boolean {
  if (list) {
    return list.length > 0;
  }
  return false;
}

function getTags(tagIds: string[]): Tag[] {
  const tags: Tag[] = [];
  tagIds.forEach((stringId) => {
    if (stringId) {
      const id = Number(stringId);
      if (!isNaN(id)) {
        const tag = tagStore.tagMap.get(id);
        if (tag) {
          tags.push(tag);
        }
      }
    }
  });
  return tags;
}

function getIngredients(ingredientIds: string[]): Ingredient[] {
  const ingredients: Ingredient[] = [];
  ingredientIds.forEach((stringId) => {
    if (stringId) {
      const id = Number(stringId);
      if (!isNaN(id)) {
        const ingredient = ingredientStore.ingredientMap.get(id);
        if (ingredient) {
          ingredients.push(ingredient);
        }
      }
    }
  });
  return ingredients;
}
