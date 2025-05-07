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

    <!-- Таблица со складами -->
    <div class="overflow-auto">
      <table class="min-w-full bg-white rounded-lg overflow-hidden">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Наименование</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Контейнеров</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Товаров всего</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Найдено</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr 
            v-for="warehouse in filteredWarehouses" 
            :key="warehouse.id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              <div class="flex items-center">
                <span class="text-blue-600 mr-2">📦</span>
                <span>{{ warehouse.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ warehouse.containers.length }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ getTotalProducts(warehouse) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span v-if="searchQuery" class="text-blue-600">
                {{ getFoundProducts(warehouse) }}
              </span>
              <span v-else>-</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
              <button 
                @click="$emit('navigate', 'warehouse', warehouse)"
                class="text-blue-600 hover:text-blue-800"
              >
                Просмотр →
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="filteredWarehouses.length === 0" class="text-center py-8 text-gray-500">
        {{ searchQuery ? "По вашему запросу ничего не найдено" : "Нет складов" }}
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

// Вспомогательные функции для подсчета товаров
const getTotalProducts = (warehouse) => {
  return warehouse.containers.reduce((sum, container) => sum + container.products.length, 0)
}

const getFoundProducts = (warehouse) => {
  if (!searchQuery.value) return 0
  
  return warehouse.containers.reduce((sum, container) => {
    if (container.filteredProductCount) {
      return sum + container.filteredProductCount
    }
    return sum + container.products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.code.includes(searchQuery.value)
    ).length
  }, 0)
}
</script>