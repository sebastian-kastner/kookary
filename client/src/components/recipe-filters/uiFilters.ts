import { tagStore, ingredientStore } from "../../stores/rootStore";
import { RecipeFilter } from "../../clients/RecipesClient";
import { Tag, Ingredient } from "../../types";

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

export type ActiveFilter = {
  name: string;
  icon: string;
  remove: () => void;
}

export type UiFilterHandler = {
  name: string;
  applyRouteFilter: (routeValue: string, filter: RecipeFilter) => void;
  getActiveFilters: (filter: RecipeFilter) => ActiveFilter[];
};

const nameFilter: UiFilterHandler = {
  name: "name",
  applyRouteFilter: (val, filter) => {
    filter.nameContains = val;
  },
  getActiveFilters: (filter) => {
    if (filter.nameContains) {
      return [{
        name: filter.nameContains,
        icon: "cursor",
        remove: () => filter.nameContains = "",
      }];
    } else {
      return [];
    }
  }
};

const tagFilter: UiFilterHandler = {
  name: "tags",
  applyRouteFilter: (val, filter) => {
    filter.tags = getTags(val.split(";"));
  },
  getActiveFilters: (filter) => {
    const activeFilters: ActiveFilter[] = [];
    if (filter.tags) {
      filter.tags.forEach((tag) => {
        activeFilters.push({
          name: tag.name || "",
          icon: "tag",
          remove: () => {
            if (filter.tags) {
              filter.tags = filter.tags.filter((t) => t.tagId !== tag.tagId);
            }
          },
        });
      });
    }
    return activeFilters;
  }
};

const ingredientFilter: UiFilterHandler = {
  name: "ingredients",
  applyRouteFilter: (val, filter) => {
    filter.ingredients = getIngredients(val.split(";"));
  },
  getActiveFilters: (filter) => {
    const activeFilters: ActiveFilter[] = [];
    if (filter.ingredients) {
      filter.ingredients.forEach((ingredient) => {
        activeFilters.push({
          name: ingredient.name || "",
          icon: "bag",
          remove: () => {
            if (filter.ingredients) {
              filter.ingredients = filter.ingredients.filter((i) => i.ingredientId !== ingredient.ingredientId);
            }
          },
        });
      });
    }
    return activeFilters;
  }
};

const seasonalFilter: UiFilterHandler = {
  name: "seasonal",
  applyRouteFilter: (val, filter) => {
    filter.isSeasonal = true;
  },
  getActiveFilters: (filter) => {
    if (filter.isSeasonal) {
      return [{
        name: "Saisonal",
        icon: "calendarWeek",
        remove: () => filter.isSeasonal = false,
      }];
    } else {
      return [];
    }
  }
};

const markedFilter: UiFilterHandler = {
  name: "marked",
  applyRouteFilter: (val, filter) => {
    filter.marked = true;
  },
  getActiveFilters: (filter) => {
    if (filter.marked) {
      return [{
        name: "Markierte Rezepte",
        icon: "bell",
        remove: () => filter.marked = false,
      }];
    } else {
      return [];
    }
  }
};

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

export const uiFilterHandlers: UiFilterHandler[] = [ 
  nameFilter,
  tagFilter,
  ingredientFilter,
  seasonalFilter,
  markedFilter,
];