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



/**
 * Ingredient
 * @export
 * @interface IngredientJsonld
 */
export interface IngredientJsonld {
    /**
     * 
     * @type {string | any}
     * @memberof IngredientJsonld
     */
    '@context'?: string | any;
    /**
     * 
     * @type {string}
     * @memberof IngredientJsonld
     */
    '@id'?: string;
    /**
     * 
     * @type {string}
     * @memberof IngredientJsonld
     */
    '@type'?: string;
    /**
     * 
     * @type {number}
     * @memberof IngredientJsonld
     */
    'ingredientId'?: number;
    /**
     * 
     * @type {string}
     * @memberof IngredientJsonld
     */
    'name'?: string;
    /**
     * 
     * @type {number}
     * @memberof IngredientJsonld
     */
    'seasonStart'?: number | null;
    /**
     * 
     * @type {number}
     * @memberof IngredientJsonld
     */
    'seasonEnd'?: number | null;
    /**
     * 
     * @type {string}
     * @memberof IngredientJsonld
     */
    'author'?: string;
    /**
     * 
     * @type {string}
     * @memberof IngredientJsonld
     */
    'category'?: string | null;
}

