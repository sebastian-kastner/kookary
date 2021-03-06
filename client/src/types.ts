export type Tag = {
    tagId?: number;
    name?: string;
    uuid: string;
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
    recipeIngredientId?: number;
    uuid: string;
    ingredient?: Ingredient | null;
    quantity?: string | null;
    unit?: string | null;
}

export type Recipe = {
    recipeId?: number;
    name?: string;
    description?: string | null;
    servings?: number | null;
    source: string | null;
    rating?: number | null;
    dateAdded?: string | null;
    images: Image[];
    marked: boolean;
    ingredients: RecipeIngredient[];
    tags: Tag[];
}

export function recipeFactory(): Recipe {
    return {
        ingredients: [],
        tags: [],
        images: [],
        source: null,
        marked: false,
    }
}
