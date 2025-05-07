<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-gray-800">Склады</h2>
      <button
        @click="$emit('showOperationForm')"
        class="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
      >
        <span class="text-xl">+</span> Новая операция
      </button>
    </div>

    <div class="relative mb-6">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <span class="text-gray-400">🔍</span>
      </div>
      <input
        type="text"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
        placeholder="Поиск по названию или артикулу товара"
        v-model="searchQuery"
        @input="$emit('search', searchQuery)"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="warehouse in filteredWarehouses" 
        :key="warehouse.id"
        class="bg-gray-50 border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-100"
        @click="$emit('navigate', 'container', warehouse, null, null)"
      >
        <div class="flex items-center mb-3">
          <span class="text-blue-600 mr-2">📦</span>
          <h3 class="text-lg font-medium text-gray-800">{{ warehouse.name }}</h3>
        </div>
        <div class="text-sm text-gray-600">
          <p>Контейнеров: {{ warehouse.containers.length }}</p>
          <p>Всего ячеек: {{ getTotalCells(warehouse) }}</p>
          <p>Заполнено: {{ getFilledCells(warehouse) }}</p>
          <p v-if="searchQuery" class="mt-2 text-blue-600">
            Найдено: {{ getFoundCells(warehouse) }} ячеек
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  filteredWarehouses: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['navigate', 'search', 'showOperationForm'])

const searchQuery = ref('')

// Вспомогательные функции для подсчета ячеек
const getTotalCells = (warehouse) => {
  return warehouse.containers.reduce((sum, container) => sum + container.cells.length, 0)
}

const getFilledCells = (warehouse) => {
  return warehouse.containers.reduce((sum, container) => 
    sum + container.cells.filter(cell => cell.product).length, 0)
}

const getFoundCells = (warehouse) => {
  if (!searchQuery.value) return 0
  
  return warehouse.containers.reduce((sum, container) => 
    sum + container.cells.filter(cell => 
      cell.product && (
        cell.product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        cell.product.code.includes(searchQuery.value)
      )
    ).length, 0)
}
</script>