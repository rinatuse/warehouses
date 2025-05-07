<template>
    <div>
      <ProductSearch 
        :warehouses="warehouses" 
        @cellSelect="handleCellSelect" 
      />
      
      <!-- Модальное окно меню действий -->
      <ActionMenu 
        :show="showActionMenu"
        :selectedCell="selectedCell"
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
        :selectedCell="selectedCell"
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
    selectedCell,
    showActionMenu,
    showOperationForm,
    operationType,
    operationForm,
    handleCellClick,
    handleCloseActionMenu,
    initiateOperation,
    handleAddOperation
  } = useWarehouse()
  
  // Обработчик выбора ячейки из результатов поиска
  const handleCellSelect = (warehouseId, containerId, cell) => {
    const warehouse = warehouses.value.find(w => w.id === warehouseId)
    const container = warehouse?.containers.find(c => c.id === containerId)
    
    // Устанавливаем выбранные значения
    selectedWarehouse.value = warehouse
    selectedContainer.value = container
    selectedCell.value = cell
    
    // Показываем меню действий
    showActionMenu.value = true
  }
  </script>