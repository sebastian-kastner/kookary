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


import { InlineResponse200HydraSearch } from './inline-response200-hydra-search';
import { InlineResponse200HydraView } from './inline-response200-hydra-view';
import { UserJsonldRead } from './user-jsonld-read';

/**
 * 
 * @export
 * @interface InlineResponse2004
 */
export interface InlineResponse2004 {
    /**
     * 
     * @type {Array<UserJsonldRead>}
     * @memberof InlineResponse2004
     */
    'hydra:member': Array<UserJsonldRead>;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse2004
     */
    'hydra:totalItems'?: number;
    /**
     * 
     * @type {InlineResponse200HydraView}
     * @memberof InlineResponse2004
     */
    'hydra:view'?: InlineResponse200HydraView;
    /**
     * 
     * @type {InlineResponse200HydraSearch}
     * @memberof InlineResponse2004
     */
    'hydra:search'?: InlineResponse200HydraSearch;
}

