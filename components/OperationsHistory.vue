<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-gray-800">История операций</h2>
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
        placeholder="Поиск по товару или местоположению"
        v-model="operationSearchQuery"
      />
    </div>

    <div v-if="filteredOperations.length > 0" class="overflow-x-auto">
      <table class="min-w-full bg-white">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата/Время</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Операция</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Товар</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Количество</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Откуда</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Куда</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="operation in filteredOperations" :key="operation.id" class="hover:bg-gray-50">
            <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(operation.date_operation) }}
            </td>
            <td class="px-4 py-2 whitespace-nowrap text-sm">
              <span :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                getStatusColor(operation.operation_name)
              ]">
                {{ operation.operation_name }}
              </span>
            </td>
            <td class="px-4 py-2 whitespace-nowrap text-sm text-blue-600">
              {{ operation.product_code }} - {{ operation.product_name }}
            </td>
            <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
              {{ operation.total }} {{ operation.unit }}
            </td>
            <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
              {{ operation.contractor_from || operation.employee_from || '-' }}
            </td>
            <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
              {{ operation.contractor_to || operation.employee_to || '-' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="text-gray-500 text-center py-8">Нет истории операций</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  operations: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['showOperationForm'])

const operationSearchQuery = ref('')

const filteredOperations = computed(() => {
  if (!operationSearchQuery.value) return props.operations
  
  return props.operations.filter(operation => 
    operation.product_name.toLowerCase().includes(operationSearchQuery.value.toLowerCase()) ||
    operation.product_code.includes(operationSearchQuery.value) ||
    (operation.contractor_from && operation.contractor_from.toLowerCase().includes(operationSearchQuery.value.toLowerCase())) ||
    (operation.contractor_to && operation.contractor_to.toLowerCase().includes(operationSearchQuery.value.toLowerCase())) ||
    (operation.employee_from && operation.employee_from.toLowerCase().includes(operationSearchQuery.value.toLowerCase())) ||
    (operation.employee_to && operation.employee_to.toLowerCase().includes(operationSearchQuery.value.toLowerCase()))
  )
})

// Функция для форматирования даты
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('ru-RU')
}

// Функция для определения цвета метки операции
const getStatusColor = (operation) => {
  switch(operation) {
    case 'перемещение': return 'bg-yellow-100 text-yellow-800';
    case 'списание': return 'bg-red-100 text-red-800';
    case 'возврат': return 'bg-green-100 text-green-800';
    case 'приход': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}
</script>