<template>
  <div>
    <!-- Переключатель режимов отображения -->
    <div v-if="!selectedWarehouse" class="bg-white rounded-lg shadow p-4 mb-4">
      <div class="flex space-x-1">
        <button
          @click="viewMode = 'warehouses'"
          class="flex-1 py-2 px-4 rounded-md focus:outline-none"
          :class="viewMode === 'warehouses' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'"
        >
          <span class="flex items-center justify-center gap-2">
            <span>📦</span>
            <span>По складам</span>
          </span>
        </button>
        <button
          @click="viewMode = 'products'"
          class="flex-1 py-2 px-4 rounded-md focus:outline-none"
          :class="viewMode === 'products' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'"
        >
          <span class="flex items-center justify-center gap-2">
            <span>📋</span>
            <span>Общая таблица</span>
          </span>
        </button>
      </div>
    </div>
    
    <!-- Отображение общей таблицы товаров -->
    <ProductsTable
      v-if="viewMode === 'products' && !selectedWarehouse"
      :warehouses="warehouses"
      @search="searchQuery = $event"
      @productSelect="handleProductSelect"
      @showOperationForm="showOperationForm = true"
    />
    
    <!-- Отображение списка складов в режиме по складам -->
    <WarehouseList 
      v-else-if="viewMode === 'warehouses' && !selectedWarehouse"
      :filteredWarehouses="filteredWarehouses"
      @navigate="handleWarehouseSelect"
      @search="searchQuery = $event"
      @showOperationForm="showOperationForm = true"
    />
    
    <!-- Отображение таблицы товаров на выбранном складе -->
    <WarehouseProductsTable
      v-else-if="selectedWarehouse"
      :warehouse="selectedWarehouse"
      @search="searchQuery = $event"
      @productSelect="handleProductSelect"
      @backToList="selectedWarehouse = null"
      @showOperationForm="showOperationForm = true"
    />
    
    <!-- Модальное окно меню действий -->
    <ActionMenu 
      :show="showActionMenu"
      :selectedProduct="selectedProduct"
      :warehouseName="selectedWarehouse?.name || ''"
      :containerName="selectedContainer?.name || ''"
      @close="handleCloseActionMenu"
      @initiateOperation="initiateOperation"
    />
    
    <!-- Модальное окно формы операции -->
    <OperationForm 
      :show="showOperationForm"
      :operationForm="operationForm"
      :selectedWarehouse="selectedWarehouse"
      :selectedContainer="selectedContainer"
      :selectedProduct="selectedProduct"
      :warehouses="warehouses"
      :operationType="operationType"
      @close="showOperationForm = false"
      @addOperation="handleAddOperation"
    />
  </div>
</template>

<script setup>
import { useWarehouse } from '@/composables/useWarehouse'

import WarehouseList from '@/components/WarehouseList.vue'
import ActionMenu from '@/components/ActionMenu.vue'
import OperationForm from '@/components/OperationForm.vue'
import ProductsTable from '@/components/ProductsTable.vue'
import WarehouseProductsTable from '@/components/WarehouseProductsTable.vue'

const {
  warehouses,
  operations,
  selectedWarehouse,
  selectedContainer,
  selectedProduct,
  searchQuery,
  showActionMenu,
  showOperationForm,
  operationType,
  operationForm,
  filteredWarehouses,
  viewMode,
  handleCloseActionMenu,
  initiateOperation,
  handleAddOperation
} = useWarehouse()

// Новый обработчик для выбора склада
function handleWarehouseSelect(level, warehouse) {
  selectedWarehouse.value = warehouse
  selectedContainer.value = null
  selectedProduct.value = null
}

// Функция для обработки выбора товара из таблицы
const handleProductSelect = (warehouseId, containerId, product) => {
  const warehouse = warehouses.value.find(w => w.id === warehouseId)
  const container = warehouse?.containers.find(c => c.id === containerId)
  
  // Устанавливаем выбранные значения
  selectedWarehouse.value = warehouse
  selectedContainer.value = container
  selectedProduct.value = product
  
  // Показываем меню действий
  showActionMenu.value = true
}
</script>