import { ref, computed } from 'vue'
import { warehouseData } from '@/data/warehouses'
import { operationsHistoryData } from '@/data/operations'

export function useWarehouse() {
  const warehouses = ref(warehouseData)
  const operations = ref(operationsHistoryData)
  const selectedWarehouse = ref(null)
  const selectedContainer = ref(null)
  const selectedCell = ref(null)
  const searchQuery = ref('')
  const showActionMenu = ref(false)
  const showOperationForm = ref(false)
  const operationType = ref(null)
  
  const operationForm = ref({
    product_code: '',
    product_name: '',
    quantity: '',
    unit: '',
    source: '',
    source_cell: '',
    destination: '',
    destination_cell: '',
    operation_name: ''
  })

  // Фильтрованные склады на основе поискового запроса
  const filteredWarehouses = computed(() => {
    if (!searchQuery.value) return warehouses.value
    
    return warehouses.value.map(warehouse => {
      const filteredContainers = warehouse.containers.map(container => {
        const filteredCells = container.cells.filter(cell => 
          cell.product && (
            cell.product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            cell.product.code.includes(searchQuery.value)
          )
        )
        
        if (filteredCells.length > 0) {
          return {
            ...container,
            cells: filteredCells
          }
        }
        
        return null
      }).filter(Boolean)
      
      if (filteredContainers.length > 0) {
        return {
          ...warehouse,
          containers: filteredContainers
        }
      }
      
      return null
    }).filter(Boolean)
  })

  // Отфильтрованные контейнеры для выбранного склада
  const filteredContainers = computed(() => {
    if (!selectedWarehouse.value) return []
    if (!searchQuery.value) return selectedWarehouse.value.containers
    
    return selectedWarehouse.value.containers.map(container => {
      const filteredCells = container.cells.filter(cell => 
        cell.product && (
          cell.product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          cell.product.code.includes(searchQuery.value)
        )
      )
      
      if (filteredCells.length > 0) {
        return {
          ...container,
          filteredCellCount: filteredCells.length
        }
      }
      
      return null
    }).filter(Boolean)
  })

  // Отфильтрованные ячейки для выбранного контейнера
  const filteredCells = computed(() => {
    if (!selectedContainer.value) return []
    if (!searchQuery.value) return selectedContainer.value.cells
    
    return selectedContainer.value.cells.filter(cell => 
      cell.product && (
        cell.product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        cell.product.code.includes(searchQuery.value)
      )
    )
  })

  // Обработчики навигации
  function handleNavigate(level, warehouse, container, cell) {
    if (level === 'warehouse') {
      selectedWarehouse.value = warehouse
      selectedContainer.value = null
      selectedCell.value = null
    } else if (level === 'container') {
      selectedWarehouse.value = warehouse
      selectedContainer.value = container
      selectedCell.value = null
    } else if (level === 'cell') {
      selectedWarehouse.value = warehouse
      selectedContainer.value = container
      selectedCell.value = cell
    }
    
    showActionMenu.value = false
  }

  // Обработчик выбора ячейки
  function handleCellClick(cell) {
    selectedCell.value = cell
    showActionMenu.value = true
  }

  // Обработчик закрытия меню действий
  function handleCloseActionMenu() {
    showActionMenu.value = false
    selectedCell.value = null
  }

  // Инициализация операции
  function initiateOperation(type) {
    operationType.value = type
    showOperationForm.value = true
    showActionMenu.value = false
    
    // Инициализация формы операции
    operationForm.value = {
      product_code: selectedCell.value?.product?.code || '',
      product_name: selectedCell.value?.product?.name || '',
      quantity: selectedCell.value?.product?.quantity || '',
      unit: selectedCell.value?.product?.unit || '',
      source: selectedWarehouse.value ? `${selectedWarehouse.value.name} / ${selectedContainer.value.name}` : '',
      source_cell: selectedCell.value?.id || '',
      destination: '',
      destination_cell: '',
      operation_name: type
    }
  }

  // Добавление новой операции
  function handleAddOperation() {
    // Создаем новую операцию
    const newOperation = {
      id: operations.value.length + 1,
      date_operation: new Date().toISOString(),
      product_code: operationForm.value.product_code,
      product_name: operationForm.value.product_name,
      total: parseFloat(operationForm.value.quantity),
      unit: operationForm.value.unit,
      contractor_from: operationForm.value.source.includes('ЦМЗ') ? 'ООО "ЦМЗ"(ИНН:7807261892)' : operationForm.value.source,
      employee_from: null,
      contractor_to: operationForm.value.destination.includes('ЦМЗ') ? 'ООО "ЦМЗ"(ИНН:7807261892)' : null,
      employee_to: operationForm.value.destination.includes('Вячеслав') ? 'Вячеслав - фрезеровщик' : null,
      operation_name: operationForm.value.operation_name
    }
    
    // Добавляем операцию в историю
    operations.value = [newOperation, ...operations.value]
    
    // Закрываем форму и сбрасываем
    showOperationForm.value = false
    operationForm.value = {
      product_code: '',
      product_name: '',
      quantity: '',
      unit: '',
      source: '',
      source_cell: '',
      destination: '',
      destination_cell: '',
      operation_name: ''
    }
  }

  return {
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
  }
}