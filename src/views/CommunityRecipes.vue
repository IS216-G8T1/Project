<template>
  <div class="community-recipes">
    <h1>Community Recipes</h1>
    
    <div class="filters">
      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search recipes (use commas to search multiple terms, e.g. 'chicken, fish')"
          @input="debouncedSearch"
        >
      </div>
      <div class="sort-options">
        <label>
          <input 
            type="checkbox" 
            v-model="sortByRating"
          >
          Show Highest Rated First
        </label>
      </div>
    </div>

    <div v-if="loading" class="loading">
      Loading recipes...
    </div>

    <div v-else-if="filteredRecipes.length === 0" class="no-results">
      No recipes found matching your search.
    </div>

    <div v-else class="recipes-grid">
      <div v-for="recipe in filteredRecipes" :key="recipe.UserMadeRecipeID" class="recipe-card">
        <h2>{{ recipe.RecipeName }}</h2>
        <div class="recipe-info">
          <p><strong>By:</strong> {{ recipe.Username }}</p>
          <p><strong>Prep Time:</strong> {{ recipe.PrepTime }}</p>
          <p><strong>Serving Size:</strong> {{ recipe.ServingSize }}</p>
          <div class="rating" v-if="recipe.AverageRating > 0">
            <span> Rating: {{ Number(recipe.AverageRating).toFixed(1) }} </span>
            <span 
              v-for="(star, index) in 5" 
              :key="index" 
              :class="getStarClass(recipe.AverageRating, index)"
              class="fa fa-star"
            ></span>
            <span>({{ recipe.RatingCount }} reviews)</span>
          </div>
          <div class="rating" v-else>
            <span>No ratings yet</span>
        </div>
        </div>

        <!-- Reviews Section -->
        <div class="reviews-section">
          <button 
            class="toggle-reviews" 
            @click="toggleReviews(recipe.UserMadeRecipeID)"
            v-if="recipe.reviews && recipe.reviews.length > 0"
          >
            {{ showReviewsFor === recipe.UserMadeRecipeID ? 'Hide Reviews' : 'Show Reviews' }}
          </button>

          <div v-if="showReviewsFor === recipe.UserMadeRecipeID && recipe.reviews" class="reviews-list">
            <div v-for="review in recipe.reviews" :key="review.ReviewID" class="review-item">
              <div class="review-header">
                <span class="review-author">{{ review.Username }}</span>
                <span class="review-rating">{{ '⭐'.repeat(review.Rating) }}</span>
                <span class="review-date">{{ review.ReviewDate }}</span>
              </div>
              <p class="review-description">{{ review.Description }}</p>
            </div>
          </div>
        </div>
        
        <!-- Review Form -->
        <div class="review-section" v-if="showReviewForm === recipe.UserMadeRecipeID">
          <h3>Add Review</h3>
          <div class="rating-input">
            <select v-model="newReview.rating">
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
          <textarea 
            v-model="newReview.description" 
            placeholder="Write your review here..."
          ></textarea>
          <div class="review-buttons">
            <button @click="submitReview(recipe.UserMadeRecipeID)">Submit Review</button>
            <button @click="showReviewForm = null">Cancel</button>
          </div>
        </div>
        
        <div class="recipe-actions">
          <button 
            v-if="isLoggedIn && recipe.Username !== currentUsername"
            @click="showReviewForm = recipe.UserMadeRecipeID"
            class="action-button"
          >
            Add Review
          </button>
          <button @click="viewRecipeDetails(recipe)" class="action-button">View Details</button>
        </div>
      </div>
    </div>

    <!-- Recipe Details Modal -->
    <div v-if="selectedRecipe" class="modal">
      <div class="modal-content">
        <span class="close" @click="selectedRecipe = null">&times;</span>
        <h2>{{ selectedRecipe.RecipeName }}</h2>
        <div class="recipe-details">
          <h3>Ingredients:</h3>
          <pre>{{ selectedRecipe.IngredientList }}</pre>
          
          <h3>Preparation Steps:</h3>
          <pre>{{ selectedRecipe.PrepSteps }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { inject } from 'vue'

export default {
  name: 'CommunityRecipes',
  setup() {
    const isLoggedIn = inject('loginState')
    const currentUsername = inject('currentUsername')
    return { isLoggedIn, currentUsername }
  },
  data() {
    return {
      recipes: [],
      searchQuery: '',
      sortByRating: false,
      selectedRecipe: null,
      showReviewForm: null,
      showReviewsFor: null,
      loading: false,
      newReview: {
        rating: 5,
        description: ''
      },
      searchTimeout: null
    }
  },
  computed: {
    filteredRecipes() {
      let result = [...this.recipes]

      // Apply search filter if there's a search query
      if (this.searchQuery) {
        const searchTerms = this.searchQuery
          .toLowerCase()
          .split(',')
          .map(term => term.trim())
          .filter(term => term.length > 0)

        result = result.filter(recipe => {
          const recipeName = recipe.RecipeName.toLowerCase()
          const ingredients = recipe.IngredientList.toLowerCase()
          
          // Check if ALL search terms are present in either recipe name or ingredients
          return searchTerms.every(term => 
            recipeName.includes(term) || ingredients.includes(term)
          )
        })
      }

      // Apply sorting
      if (this.sortByRating) {
        result.sort((a, b) => {
          // Sort by average rating (descending)
          const ratingDiff = b.AverageRating - a.AverageRating
          if (ratingDiff !== 0) return ratingDiff
          // If ratings are equal, sort by number of ratings (descending)
          return b.RatingCount - a.RatingCount
        })
      } else {
        // Sort by ID (descending) for most recent first
        result.sort((a, b) => b.UserMadeRecipeID - a.UserMadeRecipeID)
      }

      return result
    }
  },
  methods: {
    debouncedSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        // No need to fetch recipes, just let the computed property handle filtering
      }, 300)
    },
    async fetchRecipes() {
      this.loading = true
      try {
        const response = await axios.get('/api/all-personal-recipes')
        this.recipes = response.data

        // Fetch reviews for each recipe
        for (let recipe of this.recipes) {
          const reviewsResponse = await axios.get(`/api/recipe-reviews/${recipe.UserMadeRecipeID}`)
          recipe.reviews = reviewsResponse.data
        }
      } catch (error) {
        console.error('Error fetching recipes:', error)
      } finally {
        this.loading = false
      }
    },
    toggleReviews(recipeId) {
      this.showReviewsFor = this.showReviewsFor === recipeId ? null : recipeId
    },
    viewRecipeDetails(recipe) {
      this.selectedRecipe = recipe
    },
    async submitReview(recipeId) {
      if (!this.isLoggedIn) {
        alert('Please log in to submit a review')
        return
      }

      try {
        await axios.post('/api/rate-recipe', {
          userMadeRecipeId: recipeId,
          rating: Number(this.newReview.rating),
          description: this.newReview.description
        }, {
          headers: {
            'X-Username': this.currentUsername
          }
        })
        
        // Reset form and refresh recipes
        this.newReview = { rating: 5, description: '' }
        this.showReviewForm = null
        await this.fetchRecipes()
      } catch (error) {
        alert(error.response?.data?.error || 'Error submitting review')
        console.error('Error submitting review:', error)
      }
    },
      getStarClass(rating, index) {
      // Full star
      if (index < Math.floor(rating)) return 'checked'
      // Half star (only for one star, as rating is out of 5)
      if (index < Math.ceil(rating)) return 'fa-star-half-alt checked'
      // Empty star
      return ''
    }
  },
  created() {
    this.fetchRecipes()
  }
}
</script>

<style scoped>
.community-recipes {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.loading, .no-results {
  text-align: center;
  padding: 20px;
  color: #666;
}

.filters {
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
  align-items: center;
}

.search-bar {
  flex: 1;
}

.search-bar input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.sort-options {
  white-space: nowrap;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.recipe-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.recipe-info {
  margin: 10px 0;
}

.recipe-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.action-button {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button:hover {
  background-color: #45a049;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.close {
  float: right;
  cursor: pointer;
  font-size: 24px;
}

.review-section {
  margin-top: 15px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.rating-input {
  margin-bottom: 10px;
}

.rating-input select {
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

textarea {
  width: 100%;
  min-height: 100px;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

.review-buttons {
  display: flex;
  gap: 10px;
}

.reviews-section {
  margin-top: 15px;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.toggle-reviews {
  background: none;
  border: none;
  color: #4CAF50;
  cursor: pointer;
  padding: 5px 0;
  font-weight: bold;
}

.reviews-list {
  margin-top: 10px;
}

.review-item {
  background: #f9f9f9;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.review-author {
  font-weight: bold;
}

.review-date {
  color: #666;
  font-size: 0.9em;
}

.review-description {
  margin: 5px 0 0;
  color: #333;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
}

.rating {
  display: flex;
  gap: 5px;
  align-items: center;
}
.rating .fa-star.checked {
  color: gold;
}

.rating .fa-star-half-o.checked {
  color: gold;
}

.rating .fa-star {
  color: lightgray;
}

</style>
