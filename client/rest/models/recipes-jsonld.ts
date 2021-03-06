/* tslint:disable */
/* eslint-disable */
/**
 * 
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { ImagesJsonld } from './images-jsonld';
import { RecipeIngredientJsonld } from './recipe-ingredient-jsonld';

/**
 * Recipes
 * @export
 * @interface RecipesJsonld
 */
export interface RecipesJsonld {
    /**
     * 
     * @type {string | any}
     * @memberof RecipesJsonld
     */
    '@context'?: string | any;
    /**
     * 
     * @type {string}
     * @memberof RecipesJsonld
     */
    '@id'?: string;
    /**
     * 
     * @type {string}
     * @memberof RecipesJsonld
     */
    '@type'?: string;
    /**
     * 
     * @type {number}
     * @memberof RecipesJsonld
     */
    'recipeId'?: number;
    /**
     * 
     * @type {string}
     * @memberof RecipesJsonld
     */
    'name'?: string;
    /**
     * 
     * @type {string}
     * @memberof RecipesJsonld
     */
    'description'?: string;
    /**
     * 
     * @type {number}
     * @memberof RecipesJsonld
     */
    'servings'?: number;
    /**
     * 
     * @type {string}
     * @memberof RecipesJsonld
     */
    'source'?: string;
    /**
     * 
     * @type {number}
     * @memberof RecipesJsonld
     */
    'rating'?: number;
    /**
     * 
     * @type {string}
     * @memberof RecipesJsonld
     */
    'dateAdded'?: string;
    /**
     * 
     * @type {Array<ImagesJsonld>}
     * @memberof RecipesJsonld
     */
    'image'?: Array<ImagesJsonld>;
    /**
     * 
     * @type {Array<RecipeIngredientJsonld>}
     * @memberof RecipesJsonld
     */
    'recipeIngredients'?: Array<RecipeIngredientJsonld>;
    /**
     * 
     * @type {Array<string>}
     * @memberof RecipesJsonld
     */
    'tag'?: Array<string>;
}

