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


import { RecipeIngredient } from './recipe-ingredient';

/**
 * Recipe
 * @export
 * @interface Recipe
 */
export interface Recipe {
    /**
     * 
     * @type {number}
     * @memberof Recipe
     */
    'recipeId'?: number;
    /**
     * 
     * @type {string}
     * @memberof Recipe
     */
    'name'?: string;
    /**
     * 
     * @type {string}
     * @memberof Recipe
     */
    'description'?: string | null;
    /**
     * 
     * @type {number}
     * @memberof Recipe
     */
    'servings'?: number | null;
    /**
     * 
     * @type {string}
     * @memberof Recipe
     */
    'source'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Recipe
     */
    'dateAdded'?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof Recipe
     */
    'tags'?: Array<string>;
    /**
     * 
     * @type {Array<RecipeIngredient>}
     * @memberof Recipe
     */
    'ingredients'?: Array<RecipeIngredient>;
    /**
     * 
     * @type {number}
     * @memberof Recipe
     */
    'currentSeasonalityScore'?: number | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof Recipe
     */
    'images'?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof Recipe
     */
    'author'?: string;
}

