import { ref, computed } from 'vue'
import { warehouseData } from '@/data/warehouses'
import { operationsHistoryData } from '@/data/operations'

export function useWarehouse() {
  const warehouses = ref(warehouseData)
  const operations = ref(operationsHistoryData)
  const selectedWarehouse = ref(null)
  const selectedContainer = ref(null)
  const selectedProduct = ref(null) // Теперь работаем напрямую с товаром, а не с ячейкой
  const searchQuery = ref('')
  const showActionMenu = ref(false)
  const showOperationForm = ref(false)
  const operationType = ref(null)
  const viewMode = ref('warehouses') // 'warehouses' или 'products'
  
  const operationForm = ref({
    product_code: '',
    product_name: '',
    quantity: '',
    unit: '',
    source: '',
    destination: '',
    operation_name: ''
  })

  // Фильтрованные склады на основе поискового запроса
  const filteredWarehouses = computed(() => {
    if (!searchQuery.value) return warehouses.value
    
    return warehouses.value.map(warehouse => {
      const filteredContainers = warehouse.containers.map(container => {
        const filteredProducts = container.products.filter(product => 
          product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          product.code.includes(searchQuery.value)
        )
        
        if (filteredProducts.length > 0) {
          return {
            ...container,
            products: filteredProducts,
            filteredProductCount: filteredProducts.length
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

  // Обработчик закрытия меню действий
  function handleCloseActionMenu() {
    showActionMenu.value = false
    selectedProduct.value = null
  }

  // Инициализация операции
  function initiateOperation(type) {
    operationType.value = type
    showOperationForm.value = true
    showActionMenu.value = false
    
    // Инициализация формы операции с данными выбранного товара
    operationForm.value = {
      product_code: selectedProduct.value?.code || '',
      product_name: selectedProduct.value?.name || '',
      quantity: selectedProduct.value?.quantity || '',
      unit: selectedProduct.value?.unit || '',
      source: selectedWarehouse.value ? `${selectedWarehouse.value.name} / ${selectedContainer.value.name}` : '',
      destination: '',
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
      destination: '',
      operation_name: ''
    }
  }

  return {
    warehouses,
    operations,
    selectedWarehouse,
    selectedContainer,
    selectedProduct, // Вместо selectedCell возвращаем selectedProduct
    searchQuery,
    showActionMenu,
    showOperationForm,
    operationType,
    operationForm,
    viewMode,
    filteredWarehouses,
    handleCloseActionMenu,
    initiateOperation,
    handleAddOperation
  }
}