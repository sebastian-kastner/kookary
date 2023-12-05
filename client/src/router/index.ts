import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import RecipeView from "../views/RecipeView.vue";
import RecipeOverview from "../views/RecipeOverview.vue";
import Calendar from "../views/Calendar.vue";
// user views
import Account from "../views/user/Account.vue";
import RecipeEditorView from "../views/user/RecipeEditorView.vue";
import ShoppingList from "../views/user/ShoppingList.vue";
// admin views
import UserMgtmView from "../views/admin/UserMgmtView.vue";
import IngredientMgmtView from "../views/admin/IngredientMgmtView.vue";

import { userStore } from "../stores/rootStore";

const routes: Array<RouteRecordRaw> = [
  // general routes
  { path: "/", name: "home", component: HomeView },
  { path: "/recipe", name: "recipe", component: RecipeView },
  { path: "/recipes", name: "recipes", component: RecipeOverview, meta: { title: "Rezepte" } },
  { path: "/calendar", name: "calendar", component: Calendar, meta: { title: "Saisonkalender" } },
  // user routes
  { path: "/user/account", name: "account", component: Account, meta: { title: "Benutzer Account" } },
  {
    path: "/user/recipe-editor",
    name: "recipe-editor",
    component: RecipeEditorView,
    meta: { title: "Rezept bearbeiten" },
  },
  {
    path: "/user/new-recipe",
    name: "new-recipe",
    component: RecipeEditorView,
    meta: { title: "Neues Rezept" },
  },
  {
    path: "/user/shopping-list",
    name: "shopping-list",
    component: ShoppingList,
    meta: { title: "Einkaufsliste" },
  },
  // admin routes
  { path: "/admin/users", name: "user-mgmt", component: UserMgtmView, meta: { title: "Benutzerverwaltung" } },
  {
    path: "/admin/ingredients",
    name: "ingredient-mgmt",
    component: IngredientMgmtView,
    meta: { title: "Zutatenverwaltung" },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  let newTitle = "kookary";
  if (to.meta && typeof to.meta.title === "string") {
    newTitle = to.meta.title;
  }
  document.title = newTitle;

  if (to.path && to.path.startsWith("/user")) {
    if (!userStore.user) {
      next("/");
      return;
    }
  } else if (to.path && to.path.startsWith("/admin")) {
    if (!userStore.userIsAdmin) {
      next("/");
      return;
    }
  }

  next();
});

export default router;
