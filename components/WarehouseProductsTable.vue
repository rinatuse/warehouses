<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center text-sm text-gray-500 mb-4">
          <button 
            @click="$emit('backToList')"
            class="hover:text-blue-600 flex items-center"
          >
            <span class="mr-1">←</span> Назад к списку складов
          </button>
        </div>
        <h2 class="text-xl font-semibold text-gray-800">Товары на складе "{{ warehouse.name }}"</h2>
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
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Артикул - Товар</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Количество</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Контейнер</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr 
            v-for="item in filteredProducts" 
            :key="`${item.containerId}-${item.product.code}`"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span class="text-blue-600 font-medium">{{ item.product.code }}</span> - {{ item.product.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ item.product.quantity }} {{ item.product.unit }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ item.containerName }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <button
                @click="handleProductSelect(item.containerId, item.product)"
                class="text-blue-600 hover:text-blue-800"
              >
                Операции
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="filteredProducts.length === 0" class="text-center py-8 text-gray-500">
        {{ searchQuery ? "По вашему запросу ничего не найдено" : "На этом складе нет товаров" }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  warehouse: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['search', 'productSelect', 'showOperationForm', 'backToList'])

const searchQuery = ref('')

// Создаем список всех продуктов на выбранном складе
const warehouseProducts = computed(() => {
  const results = []
  
  props.warehouse.containers.forEach(container => {
    container.products.forEach(product => {
      results.push({
        containerId: container.id,
        containerName: container.name,
        product: product
      })
    })
  })
  
  return results
})

// Фильтруем продукты на основе поискового запроса
const filteredProducts = computed(() => {
  if (!searchQuery.value) return warehouseProducts.value
  
  return warehouseProducts.value.filter(item => 
    item.product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    item.product.code.includes(searchQuery.value)
  )
})

// Обработчик выбора товара
const handleProductSelect = (containerId, product) => {
  emit('productSelect', props.warehouse.id, containerId, product)
}
</script>