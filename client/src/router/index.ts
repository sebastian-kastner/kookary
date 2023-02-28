import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import RecipeView from '../views/RecipeView.vue';
import RecipeOverview from '../views/RecipeOverview.vue';
// user views
import Account from '../views/user/Account.vue';
import RecipeEditorView from '../views/RecipeEditorView.vue';
import ShoppingList from '../views/user/ShoppingList.vue';
// admin views
import UserMgtmView from '../views/admin/UserMgmtView.vue';
import IngredientMgmtView from '../views/admin/IngredientMgmtView.vue'

import { userStore } from '../stores/rootStore';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  // general routes
  { path: '/', name: 'home', component: HomeView },
  { path: '/recipe', name: 'recipe', component: RecipeView },
  { path: '/recipes', name: 'recipes', component: RecipeOverview },
  // user routes
  { path: '/user/account', name: 'account', component: Account },
  { path: '/user/recipe-editor', name: 'recipe-editor', component: RecipeEditorView },
  { path: '/user/shopping-list', name: 'shopping-list', component: ShoppingList },
  // admin routes
  { path: '/admin/users', name: 'user-mgmt', component: UserMgtmView },
  { path: '/admin/ingredients', name: 'ingredient-mgmt', component: IngredientMgmtView },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path && to.path.startsWith("/user")) {
    if (!userStore.user) {
      next("/");
      return;
    }
  } else if (to.path && to.path.startsWith("/admin")) {
    if(!userStore.userIsAdmin) {
      next("/");
      return;
    }
  }

  next();
});

export default router
