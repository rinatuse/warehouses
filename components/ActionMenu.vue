<template>
  <div v-if="show && selectedCell && selectedCell.product" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h2 class="text-xl font-semibold text-gray-800">Действия с товаром</h2>
          <p class="text-gray-600">
            {{ selectedCell.product.name }} ({{ selectedCell.product.quantity }} {{ selectedCell.product.unit }})
          </p>
          <p class="text-sm text-gray-500">
            Местоположение: {{ warehouseName }} / {{ containerName }}, Ячейка: {{ selectedCell.id }}
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
      
      <div class="space-y-4 mt-6">
        <button
          @click="$emit('initiateOperation', 'перемещение')"
          class="flex items-center gap-2 w-full p-3 text-left bg-yellow-50 text-yellow-800 rounded-lg hover:bg-yellow-100"
        >
          <span class="text-xl">↔️</span>
          <div>
            <p class="font-medium">Переместить на другой склад/ячейку</p>
            <p class="text-sm">Перемещение товара между ячейками или складами</p>
          </div>
        </button>
        
        <button
          @click="$emit('initiateOperation', 'списание')"
          class="flex items-center gap-2 w-full p-3 text-left bg-red-50 text-red-800 rounded-lg hover:bg-red-100"
        >
          <span class="text-xl">🗑️</span>
          <div>
            <p class="font-medium">Списать товар</p>
            <p class="text-sm">Списание товара со склада</p>
          </div>
        </button>
        
        <button
          @click="$emit('initiateOperation', 'отгрузка')"
          class="flex items-center gap-2 w-full p-3 text-left bg-green-50 text-green-800 rounded-lg hover:bg-green-100"
        >
          <span class="text-xl">↘️</span>
          <div>
            <p class="font-medium">Отгрузить товар</p>
            <p class="text-sm">Отгрузка товара на производство или клиенту</p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  selectedCell: {
    type: Object,
    default: null
  },
  warehouseName: {
    type: String,
    default: ''
  },
  containerName: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'initiateOperation'])
</script>