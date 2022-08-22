import Vuex from 'vuex';
import Vue from 'vue'
import { createProxy, extractVuexModule } from "vuex-class-component";
import { TagStore } from './tagStore'
import IngredientStore from './ingredientStore';
import MediaObjectStore from './mediaObjectStore';

Vue.use(Vuex);

// init stores
export const rootStore = new Vuex.Store({
  modules: {
    ...extractVuexModule( TagStore ),
    ...extractVuexModule( IngredientStore ),
    ...extractVuexModule( MediaObjectStore ),
  }
})

export const ingredientStore = createProxy(rootStore, IngredientStore);
export const tagStore = createProxy(rootStore, TagStore);
export const mediaObjectStore = createProxy(rootStore, MediaObjectStore);

export async function initStores(): Promise<void> {
  const ingredientInit = ingredientStore.init();
  const tagsInit = tagStore.init();
  const mediaObjectInit = mediaObjectStore.init();

  await Promise.all([ingredientInit, tagsInit, mediaObjectInit]);
}

