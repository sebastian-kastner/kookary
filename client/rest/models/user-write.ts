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
 * User
 * @export
 * @interface UserWrite
 */
export interface UserWrite {
    /**
     * 
     * @type {number}
     * @memberof UserWrite
     */
    'id'?: number;
    /**
     * 
     * @type {string}
     * @memberof UserWrite
     */
    'email'?: string;
    /**
     * 
     * @type {string}
     * @memberof UserWrite
     */
    'displayname'?: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof UserWrite
     */
    'roles'?: Array<string>;
    /**
     * The hashed password
     * @type {string}
     * @memberof UserWrite
     */
    'password'?: string;
}

