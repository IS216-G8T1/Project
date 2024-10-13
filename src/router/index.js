// Import necessary functions from vue-router
import { createRouter, createWebHistory } from 'vue-router'

// Import components for routes that are always needed
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Profile from '../views/Profile.vue'
import RecipeSearch from '../views/RecipeSearch.vue'

// Create a new router instance
const router = createRouter({
  // Use web history mode for cleaner URLs
  history: createWebHistory(import.meta.env.BASE_URL),
  // Define the routes for the application
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
      // Lazy-load the Signup component
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
      // Lazy-load the Favourites component
      component: () => import('../views/Favourites.vue')
    },
    {
      path: '/personal-recipes',
      name: 'personalRecipes',
      // Lazy-load the PersonalRecipes component
      component: () => import('../views/PersonalRecipes.vue')
    },
    {
      path: '/shopping-list',
      name: 'shoppingList',
      // Lazy-load the ShoppingList component
      component: () => import('../views/ShoppingList.vue')
    },
    {
      path: '/create-recipe',
      name: 'createRecipe',
      // Lazy-load the CreateRecipe component
      component: () => import('../views/CreateRecipe.vue')
    }
  ]
})

// Export the router instance to be used in main.js
export default router
