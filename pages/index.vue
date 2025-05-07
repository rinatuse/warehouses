<template>
    <div>
      <!-- Отображение списка складов -->
      <WarehouseList 
        v-if="!selectedWarehouse"
        :filteredWarehouses="filteredWarehouses"
        @navigate="handleNavigate"
        @search="searchQuery = $event"
        @showOperationForm="showOperationForm = true"
      />
      
      <!-- Отображение списка контейнеров выбранного склада -->
      <ContainerList 
        v-else-if="selectedWarehouse && !selectedContainer"
        :selectedWarehouse="selectedWarehouse"
        :filteredContainers="filteredContainers"
        @navigate="handleNavigate"
        @search="searchQuery = $event"
        @showOperationForm="showOperationForm = true"
      />
      
      <!-- Отображение списка ячеек выбранного контейнера -->
      <CellList 
        v-else-if="selectedWarehouse && selectedContainer"
        :selectedWarehouse="selectedWarehouse"
        :selectedContainer="selectedContainer"
        :selectedCell="selectedCell"
        :filteredCells="filteredCells"
        @navigate="handleNavigate"
        @search="searchQuery = $event"
        @cellClick="handleCellClick"
        @initiateOperation="initiateOperation"
        @showOperationForm="showOperationForm = true"
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
  
  import WarehouseList from '@/components/WarehouseList.vue'
  import ContainerList from '@/components/ContainerList.vue'
  import CellList from '@/components/CellList.vue'
  import ActionMenu from '@/components/ActionMenu.vue'
  import OperationForm from '@/components/OperationForm.vue'
  
  const {
    warehouses,
    operations,
    selectedWarehouse,
    selectedContainer,
    selectedCell,
    searchQuery,
    showActionMenu,
    showOperationForm,
    operationType,
    operationForm,
    filteredWarehouses,
    filteredContainers,
    filteredCells,
    handleNavigate,
    handleCellClick,
    handleCloseActionMenu,
    initiateOperation,
    handleAddOperation
  } = useWarehouse()
  </script>