<template>
  <div>
    <ProductSearch 
      :warehouses="warehouses" 
      @cellSelect="handleProductSelect" 
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
import ProductSearch from '@/components/ProductSearch.vue'
import ActionMenu from '@/components/ActionMenu.vue'
import OperationForm from '@/components/OperationForm.vue'

const {
  warehouses,
  selectedWarehouse,
  selectedContainer,
  selectedProduct,
  showActionMenu,
  showOperationForm,
  operationType,
  operationForm,
  handleCloseActionMenu,
  initiateOperation,
  handleAddOperation
} = useWarehouse()

// Обработчик выбора товара из результатов поиска
const handleProductSelect = (warehouseId, containerId, product) => {
  console.log('Товар выбран:', product)
  
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