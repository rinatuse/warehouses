<template>
    <div>
      <OperationsHistory 
        :operations="operations" 
        @showOperationForm="showOperationForm = true" 
      />
      
      <!-- Модальное окно формы операции -->
      <OperationForm 
        :show="showOperationForm"
        :operationForm="operationForm"
        :warehouses="warehouses"
        @close="showOperationForm = false"
        @addOperation="handleAddOperation"
      />
    </div>
  </template>
  
  <script setup>
  import { useWarehouse } from '@/composables/useWarehouse'
  import OperationsHistory from '@/components/OperationsHistory.vue'
  import OperationForm from '@/components/OperationForm.vue'
  
  const {
    warehouses,
    operations,
    showOperationForm,
    operationForm,
    handleAddOperation
  } = useWarehouse()
  </script>