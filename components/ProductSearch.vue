<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-gray-800">Поиск товара на складе</h2>
    </div>
    
    <div class="relative mb-6">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <span class="text-gray-400">🔍</span>
      </div>
      <input
        type="text"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
        placeholder="Введите название или артикул товара"
        v-model="productSearchQuery"
      />
    </div>

    <template v-if="matchingCells.length > 0">
      <p class="text-gray-600 mb-4">Найдено {{ matchingCells.length }} соответствий:</p>
      <div class="grid grid-cols-1 gap-4">
        <div 
          v-for="(match, index) in matchingCells" 
          :key="index"
          class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
          @click="$emit('cellSelect', match.warehouseId, match.containerId, match.cell)"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-medium text-gray-900">{{ match.cell.product.name }}</h3>
              <p class="text-sm text-gray-500">Артикул: {{ match.cell.product.code }}</p>
              <p class="text-sm text-gray-500">Количество: {{ match.cell.product.quantity }} {{ match.cell.product.unit }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-blue-600">{{ match.warehouseName }} / {{ match.containerName }}</p>
              <p class="text-sm text-gray-500">Ячейка: {{ match.cell.id }}</p>
              <p class="text-sm text-gray-500">Ряд: {{ match.cell.row }}, Полка: {{ match.cell.shelf }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>
    <p v-else-if="productSearchQuery" class="text-gray-500 text-center py-8">
      По вашему запросу ничего не найдено
    </p>
    <p v-else class="text-gray-500 text-center py-8">
      Введите запрос для поиска товара
    </p>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  warehouses: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['cellSelect'])

const productSearchQuery = ref('')

// Вычисляемое свойство для нахождения ячеек с искомым товаром
const matchingCells = computed(() => {
  if (!productSearchQuery.value) return []
  
  const results = []
  
  props.warehouses.forEach(warehouse => {
    warehouse.containers.forEach(container => {
      container.cells.forEach(cell => {
        if (cell.product && (
          cell.product.name.toLowerCase().includes(productSearchQuery.value.toLowerCase()) ||
          cell.product.code.includes(productSearchQuery.value)
        )) {
          results.push({
            warehouseId: warehouse.id,
            warehouseName: warehouse.name,
            containerId: container.id,
            containerName: container.name,
            cell: cell
          })
        }
      })
    })
  })
  
  return results
})
</script>