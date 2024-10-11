import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Profile from '../views/Profile.vue'
import RecipeSearch from '../views/RecipeSearch.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/Signup.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/recipe-search',
      name: 'recipeSearch',
      component: RecipeSearch
    },
    {
      path: '/favourites',
      name: 'favourites',
      component: () => import('../views/Favourites.vue')
    },
    {
      path: '/personal-recipes',
      name: 'personalRecipes',
      component: () => import('../views/PersonalRecipes.vue')
    },
    {
      path: '/shopping-list',
      name: 'shoppingList',
      component: () => import('../views/ShoppingList.vue')
    }
  ]
})

export default router
