import { tagStore, ingredientStore } from "../../stores/rootStore";
import { RecipeFilter } from "../../clients/RecipesClient";
import { Tag, Ingredient } from "../../types";

export type ActiveFilter = {
  name: string;
  icon: string;
  remove: () => void;
}

export abstract class FilterHandler {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }

  public abstract applyRouteFilter(val: string, filter: RecipeFilter): Promise<void>;
  public abstract getRouteParams(filter: RecipeFilter): string | null;
  public abstract getActiveFilters(filter: RecipeFilter): ActiveFilter[];
}

class NameFilterHandler extends FilterHandler {
  constructor() {
    super("name");
  }

  public async applyRouteFilter(val: string, filter: RecipeFilter): Promise<void> {
    filter.nameContains = val;
  }

  public getRouteParams(filter: RecipeFilter): string | null {
    if (filter.nameContains) {
      return filter.nameContains;
    }
    return null;
  }

  public getActiveFilters(filter: RecipeFilter): ActiveFilter[] {
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
}

class TagFilterHandler extends FilterHandler {
  constructor() {
    super("tags");
  }

  public async applyRouteFilter(val: string, filter: RecipeFilter): Promise<void> {
    return new Promise((resolve) => {
      tagStore.awaitInit().then(() => {
        filter.tags = this.getTags(val.split(";"));
      }).finally(() => resolve());
    });
  }

  public getRouteParams(filter: RecipeFilter): string | null {
    if (filter.tags) {
      return filter.tags.map((t) => t.tagId).join(";");
    }
    return null;
  }

  public getActiveFilters(filter: RecipeFilter): ActiveFilter[] {
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

  private getTags(tagIds: string[]): Tag[] {
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
}

class IngredientFilterHandler extends FilterHandler {
  constructor() {
    super("ingredients");
  }

  public async applyRouteFilter(val: string, filter: RecipeFilter): Promise<void> {
    return new Promise((resolve) => {
      ingredientStore.awaitInit().then(() => {
        filter.ingredients = this.getIngredients(val.split(";"));
      }).finally(() => resolve());
    });
  }

  public getRouteParams(filter: RecipeFilter): string | null {
    if (filter.ingredients) {
      return filter.ingredients.map((i) => i.ingredientId).join(";");
    }
    return null;
  }

  public getActiveFilters(filter: RecipeFilter): ActiveFilter[] {
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

  private getIngredients(ingredientIds: string[]): Ingredient[] {
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

}

class SeasonalFilterHandler extends FilterHandler {
  constructor() {
    super("seasonal");
  }

  public async applyRouteFilter(val: string, filter: RecipeFilter): Promise<void> {
    filter.isSeasonal = true;
  }

  public getRouteParams(filter: RecipeFilter): string | null {
    if (filter.isSeasonal) {
      return "true";
    }
    return null;
  }

  public getActiveFilters(filter: RecipeFilter): ActiveFilter[] {
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
}

class MarkedFilterHandler extends FilterHandler {
  constructor() {
    super("marked");
  }

  public async applyRouteFilter(val: string, filter: RecipeFilter): Promise<void> {
    filter.marked = true;
  }

  public getRouteParams(filter: RecipeFilter): string | null {
    if (filter.marked) {
      return "true";
    }
    return null;
  }

  public getActiveFilters(filter: RecipeFilter): ActiveFilter[] {
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
}

class OrderByFilterHandler extends FilterHandler {
  constructor() {
    super("orderBy");
  }

  public async applyRouteFilter(val: string, filter: RecipeFilter): Promise<void> {
    if (val === "date" || val === "name") {
      filter.orderBy = val;
    }
  }

  public getRouteParams(filter: RecipeFilter): string | null {
    if (filter.orderBy) {
      return filter.orderBy;
    }
    return null;
  }

  public getActiveFilters(): ActiveFilter[] {
    return [];
  }
}

class OrderByDirectionFilterHandler extends FilterHandler {
  constructor() {
    super("orderByDirection");
  }

  public async applyRouteFilter(val: string, filter: RecipeFilter): Promise<void> {
    if (val === "asc" || val === "desc") {
      filter.orderByDirection = val;
    }
  }

  public getRouteParams(filter: RecipeFilter): string | null {
    if (filter.orderByDirection) {
      return filter.orderByDirection;
    }
    return null;
  }

  public getActiveFilters(): ActiveFilter[] {
    return [];
  }
}

export const filterHandlers: FilterHandler[] = [
  new NameFilterHandler(),
  new TagFilterHandler(),
  new IngredientFilterHandler(),
  new SeasonalFilterHandler(),
  new MarkedFilterHandler(),
  new OrderByFilterHandler(),
  new OrderByDirectionFilterHandler(),
];