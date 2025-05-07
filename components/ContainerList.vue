<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <Breadcrumbs 
          :path="{ warehouse: selectedWarehouse }"
          @navigate="handleNavigate"
        />
        <h2 class="text-xl font-semibold text-gray-800">Контейнеры в "{{ selectedWarehouse.name }}"</h2>
      </div>
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
        v-for="container in filteredContainers" 
        :key="container.id"
        class="bg-gray-50 border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-100"
        @click="$emit('navigate', 'cell', selectedWarehouse, container, null)"
      >
        <div class="flex items-center mb-3">
          <span class="text-blue-600 mr-2">📦</span>
          <h3 class="text-lg font-medium text-gray-800">{{ container.name }}</h3>
        </div>
        <div class="text-sm text-gray-600">
          <p>Всего ячеек: {{ container.cells ? container.cells.length : 0 }}</p>
          <p>Заполнено: {{ getFilledCells(container) }}</p>
          <p v-if="searchQuery" class="mt-2 text-blue-600">
            Найдено: {{ container.filteredCellCount || 0 }} ячеек
          </p>
        </div>
      </div>
    </div>
    
    <div v-if="filteredContainers.length === 0" class="text-center py-8 text-gray-500">
      {{ searchQuery ? "По вашему запросу ничего не найдено" : "Нет контейнеров" }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Breadcrumbs from './Breadcrumbs.vue'

const props = defineProps({
  selectedWarehouse: {
    type: Object,
    required: true
  },
  filteredContainers: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['navigate', 'search', 'showOperationForm'])

const searchQuery = ref('')

const getFilledCells = (container) => {
  if (!container.cells) return 0
  return container.cells.filter(cell => cell.product).length
}

const handleNavigate = (level, warehouse, container, cell) => {
  emit('navigate', level, warehouse, container, cell)
}
</script>