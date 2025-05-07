<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <Breadcrumbs 
          :path="{ warehouse: selectedWarehouse, container: selectedContainer }"
          @navigate="handleNavigate"
        />
        <h2 class="text-xl font-semibold text-gray-800">Ячейки в "{{ selectedContainer.name }}"</h2>
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

    <div class="overflow-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Товар</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Количество</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr 
            v-for="cell in filteredCells" 
            :key="cell.id"
            :class="[
              'hover:bg-gray-50', 
              selectedCell && selectedCell.id === cell.id ? 'bg-blue-50' : ''
            ]"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div v-if="cell.product" class="flex items-center">
                <span class="font-medium text-blue-600">{{ cell.product.code }}</span>
                <span class="mx-1">-</span>
                <span>{{ cell.product.name }}</span>
              </div>
              <span v-else class="text-gray-400">Пусто</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ cell.product ? `${cell.product.quantity} ${cell.product.unit}` : '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <button
                v-if="cell.product"
                @click="$emit('cellClick', cell)"
                class="text-blue-600 hover:text-blue-800"
              >
                Операции
              </button>
              <button
                v-else
                @click="$emit('initiateOperation', 'приход')"
                class="text-green-600 hover:text-green-800"
              >
                Добавить товар
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="filteredCells.length === 0" class="text-center py-8 text-gray-500">
        {{ searchQuery ? "По вашему запросу ничего не найдено" : "Нет ячеек" }}
      </div>
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
  selectedContainer: {
    type: Object,
    required: true
  },
  selectedCell: {
    type: Object,
    default: null
  },
  filteredCells: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['navigate', 'search', 'cellClick', 'initiateOperation', 'showOperationForm'])

const searchQuery = ref('')

const handleNavigate = (level, warehouse, container, cell) => {
  emit('navigate', level, warehouse, container, cell)
}
</script>