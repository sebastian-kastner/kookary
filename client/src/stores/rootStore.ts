import Vuex from 'vuex';
import Vue from 'vue'
import { createProxy, extractVuexModule } from "vuex-class-component";
import { TagStore } from './tagStore';
import { IngredientCategoryStore } from './ingredientCategoryStore';
import IngredientStore from './ingredientStore';
import MediaObjectStore from './mediaObjectStore';
import { UserStore } from './userStore'

Vue.use(Vuex);

// init stores
export const rootStore = new Vuex.Store({
  modules: {
    ...extractVuexModule(TagStore),
    ...extractVuexModule(IngredientStore),
    ...extractVuexModule(MediaObjectStore),
    ...extractVuexModule(UserStore),
    ...extractVuexModule(IngredientCategoryStore),
  }
})

export const ingredientStore = createProxy(rootStore, IngredientStore);
export const tagStore = createProxy(rootStore, TagStore);
export const mediaObjectStore = createProxy(rootStore, MediaObjectStore);
export const userStore = createProxy(rootStore, UserStore);
export const ingredientCategoryStore = createProxy(rootStore, IngredientCategoryStore);

export async function initStores(): Promise<void> {
  const ingredientInit = ingredientStore.init();
  const tagsInit = tagStore.init();
  const mediaObjectInit = mediaObjectStore.init();
  const categoryStoreInit = ingredientCategoryStore.init();
  const usersInit = userStore.initUsers();

  userStore.refreshToken();
  setInterval(() => {
    userStore.refreshToken();
  }, 180000);

  return new Promise<void>((resolve) => {
    Promise.all([ingredientInit, tagsInit, mediaObjectInit, categoryStoreInit, usersInit]).then(() => {
      resolve();
    });
  });
}

