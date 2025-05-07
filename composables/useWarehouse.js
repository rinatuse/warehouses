import { ref, computed } from 'vue'
import { warehouseData } from '@/data/warehouses'
import { operationsHistoryData } from '@/data/operations'

export function useWarehouse() {
  const warehouses = ref(warehouseData)
  const operations = ref(operationsHistoryData)
  const selectedWarehouse = ref(null)
  const selectedContainer = ref(null)
  const selectedCell = ref(null)
  const selectedProduct = ref(null)
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
    
    // Инициализация формы операции с данными выбранного товара или ячейки
    operationForm.value = {
      product_code: selectedProduct.value?.code || selectedCell.value?.product?.code || '',
      product_name: selectedProduct.value?.name || selectedCell.value?.product?.name || '',
      quantity: selectedProduct.value?.quantity || selectedCell.value?.product?.quantity || '',
      unit: selectedProduct.value?.unit || selectedCell.value?.product?.unit || '',
      source: selectedWarehouse.value ? `${selectedWarehouse.value.name} / ${selectedContainer.value.name}` : '',
      destination: '',
      operation_name: type
    }
  }

  // Добавление новой операции (теперь принимает данные формы)
  function handleAddOperation(formData) {
    console.log('Получены данные:', formData)
    
    // Создаем новую операцию
    const newOperation = {
      id: operations.value.length + 1,
      date_operation: new Date().toISOString(),
      product_code: formData.product_code,
      product_name: formData.product_name,
      total: parseFloat(formData.quantity),
      unit: formData.unit,
      cost: null,
      contractor_from: formData.source.includes('ЦМЗ') || formData.source.includes('Основной склад') ? 
                      'ООО "ЦМЗ"(ИНН:7807261892)' : 
                      formData.source.includes('Магазин') || formData.source.includes('Авто') ? 
                      formData.source : null,
      employee_from: null,
      contractor_to: formData.destination.includes('ЦМЗ') || formData.destination.includes('Основной склад') ? 
                     'ООО "ЦМЗ"(ИНН:7807261892)' : null,
      employee_to: formData.destination.includes('Вячеслав') ? 'Вячеслав - фрезеровщик' : 
                  formData.destination.includes('Иванов') ? 'Иванов И.И. - сварщик' :
                  formData.destination.includes('Списание') ? null : null,
      operation_name: formData.operation_name
    }
    
    console.log('Создана операция:', newOperation)
    
    // Добавляем операцию в историю
    operations.value = [newOperation, ...operations.value]
    
    // Обновляем состояние товаров на складе в зависимости от типа операции
    updateWarehouseState(formData)
    
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
  
  // Обновление состояния склада после операции
  function updateWarehouseState(formData) {
    const quantity = parseFloat(formData.quantity)
    
    // Находим склад и контейнер источника
    let sourceWarehouse, sourceContainer
    
    if (selectedWarehouse.value && selectedContainer.value) {
      sourceWarehouse = selectedWarehouse.value
      sourceContainer = selectedContainer.value
    } else if (formData.source_warehouse && formData.source_container) {
      sourceWarehouse = warehouses.value.find(w => w.id === parseInt(formData.source_warehouse))
      sourceContainer = sourceWarehouse?.containers.find(c => c.id === parseInt(formData.source_container))
    }
    
    // Обработка в зависимости от типа операции
    switch (formData.operation_name) {
      case 'приход':
        // Находим целевой склад и контейнер
        const targetWarehouse = warehouses.value.find(w => w.id === parseInt(formData.destination_warehouse))
        const targetContainer = targetWarehouse?.containers.find(c => c.id === parseInt(formData.destination_container))
        
        if (targetContainer) {
          // Добавляем товар в products контейнера
          const existingProduct = targetContainer.products.find(p => p.code === formData.product_code)
          
          if (existingProduct) {
            existingProduct.quantity = parseFloat(existingProduct.quantity) + quantity
          } else {
            targetContainer.products.push({
              code: formData.product_code,
              name: formData.product_name,
              quantity: quantity,
              unit: formData.unit
            })
          }
        }
        break
        
      case 'списание':
      case 'отгрузка':
        // Уменьшаем количество товара в исходном контейнере
        if (sourceContainer) {
          const product = sourceContainer.products.find(p => p.code === formData.product_code)
          
          if (product) {
            product.quantity = Math.max(0, parseFloat(product.quantity) - quantity)
          }
        }
        break
        
      case 'перемещение':
        // Находим целевой склад и контейнер
        const destWarehouse = warehouses.value.find(w => w.id === parseInt(formData.destination_warehouse))
        const destContainer = destWarehouse?.containers.find(c => c.id === parseInt(formData.destination_container))
        
        // Уменьшаем количество в исходном контейнере
        if (sourceContainer) {
          const sourceProduct = sourceContainer.products.find(p => p.code === formData.product_code)
          
          if (sourceProduct) {
            sourceProduct.quantity = Math.max(0, parseFloat(sourceProduct.quantity) - quantity)
          }
        }
        
        // Увеличиваем количество в целевом контейнере
        if (destContainer) {
          const targetProduct = destContainer.products.find(p => p.code === formData.product_code)
          
          if (targetProduct) {
            targetProduct.quantity = parseFloat(targetProduct.quantity) + quantity
          } else {
            destContainer.products.push({
              code: formData.product_code,
              name: formData.product_name,
              quantity: quantity,
              unit: formData.unit
            })
          }
        }
        break
    }
  }

  return {
    warehouses,
    operations,
    selectedWarehouse,
    selectedContainer,
    selectedCell,
    selectedProduct,
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