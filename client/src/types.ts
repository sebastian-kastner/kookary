export type Tag = {
    tagId?: number;
    name?: string;
}

export type Image = {
    imageId?: number;
    date?: string;
    path?: string;
}

export type Ingredient = {
    ingredientId?: number;
    name?: string;
}

export type RecipeIngredient = {
    ingredientId?: number;
    ingredient?: Ingredient | null;
    recipeId?: string | null;
    amount?: string;
    unit?: string;
}

export type Recipe = {
    recipeId?: number;
    name?: string;
    description?: string;
    servings?: number;
    source?: string;
    rating?: number;
    timesCooked?: number;
    dateAdded?: string;
    images?: Image[];
    recipeIngredients?: RecipeIngredient[];
    tags?: Tag[];
}
