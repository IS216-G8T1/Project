<template>
  <div class="shopping-list">
    <h1>Shopping List</h1>
    <div class="add-item">
      <input v-model="newItem" placeholder="Add new item" @keyup.enter="addItem">
      <button @click="addItem">Add</button>
    </div>
    <ul v-if="items.length">
      <li v-for="(item, index) in items" :key="index">
        <span :class="{ 'completed': item.completed }">{{ item.name }}</span>
        <div>
          <button @click="toggleComplete(index)">{{ item.completed ? 'Undo' : 'Complete' }}</button>
          <button @click="removeItem(index)">Remove</button>
        </div>
      </li>
    </ul>
    <p v-else>Your shopping list is empty.</p>
  </div>
</template>

<script>
export default {
  name: 'ShoppingList',
  data() {
    return {
      items: [
        { name: 'Milk', completed: false },
        { name: 'Bread', completed: false },
        { name: 'Eggs', completed: true }
      ],
      newItem: ''
    }
  },
  methods: {
    addItem() {
      if (this.newItem.trim()) {
        this.items.push({ name: this.newItem, completed: false })
        this.newItem = ''
      }
    },
    toggleComplete(index) {
      this.items[index].completed = !this.items[index].completed
    },
    removeItem(index) {
      this.items.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.shopping-list {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #5d4037;
}

.add-item {
  display: flex;
  margin-bottom: 20px;
}

input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #795548;
  border-radius: 4px 0 0 4px;
}

button {
  padding: 10px 15px;
  background-color: #ffa726;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #ff9800;
}

.add-item button {
  border-radius: 0 4px 4px 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #ffe0b2;
  border-radius: 4px;
  margin-bottom: 10px;
}

.completed {
  text-decoration: line-through;
  color: #7f7f7f;
}

li button {
  margin-left: 10px;
  padding: 5px 10px;
  border-radius: 4px;
}
</style>
