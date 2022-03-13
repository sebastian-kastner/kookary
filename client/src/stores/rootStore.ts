import Vuex from 'vuex';
import Vue from 'vue'
import { createProxy, extractVuexModule } from "vuex-class-component";
import { TagStore } from './tagStore'
import IngredientStore from './ingredientStore';

Vue.use(Vuex);

// init stores
export const rootStore = new Vuex.Store({
  modules: {
    ...extractVuexModule( TagStore ),
    ...extractVuexModule( IngredientStore ),
  }
})

export const ingredientStore = createProxy(rootStore, IngredientStore);
export const tagStore = createProxy(rootStore, TagStore);

ingredientStore.init();
tagStore.init();
