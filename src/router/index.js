import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Profile from '../views/Profile.vue'

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
      component: () => import('../views/RecipeSearch.vue')
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('../views/Favorites.vue')
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
