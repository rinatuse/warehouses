<template>
    <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <div class="flex justify-between items-start mb-6">
          <h2 class="text-xl font-semibold text-gray-800">{{ formTitle }}</h2>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div class="space-y-4">
          <!-- Тип операции -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Тип операции
            </label>
            <select
              v-model="localForm.operation_name"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              @change="updateFormData"
            >
              <option value="">Выберите тип операции</option>
              <option value="приход">Приход</option>
              <option value="списание">Списание</option>
              <option value="перемещение">Перемещение</option>
              <option value="отгрузка">Отгрузка</option>
            </select>
          </div>
          
          <!-- Товар -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Товар <span class="text-red-500">*</span>
            </label>
            <select
              v-model="localForm.product_code"
              @change="handleProductSelect"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              :disabled="!!selectedCell?.product"
            >
              <option value="">Выберите товар</option>
              <option v-for="product in products" :key="product.code" :value="product.code">
                {{ product.code }} - {{ product.name }}
              </option>
            </select>
          </div>
          
          <!-- Количество -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Количество <span class="text-red-500">*</span>
            </label>
            <div class="flex items-center">
              <input
                type="text"
                v-model="localForm.quantity"
                class="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
              />
              <span class="p-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-500">
                {{ localForm.unit }}
              </span>
            </div>
          </div>
          
          <!-- Откуда - показываем для всех операций кроме прихода -->
          <div v-if="localForm.operation_name && localForm.operation_name !== 'приход'">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Откуда <span class="text-red-500">*</span>
            </label>
            <input
              v-if="selectedWarehouse && selectedContainer && selectedCell"
              type="text"
              v-model="sourcePath"
              readonly
              class="w-full p-2 bg-gray-50 border border-gray-300 rounded-md"
            />
            <div v-else class="space-y-2">
              <select
                v-model="localForm.source_warehouse"
                @change="updateFormData"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Выберите склад</option>
                <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
                  {{ warehouse.name }}
                </option>
              </select>
  
              <select
                v-if="localForm.source_warehouse"
                v-model="localForm.source_container"
                @change="updateFormData"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Выберите контейнер</option>
                <option 
                  v-for="container in getContainers(localForm.source_warehouse)" 
                  :key="container.id" 
                  :value="container.id"
                >
                  {{ container.name }}
                </option>
              </select>
  
              <select
                v-if="localForm.source_container"
                v-model="localForm.source_cell"
                @change="updateFormData"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Выберите ячейку</option>
                <option 
                  v-for="cell in getFilledCells(localForm.source_warehouse, localForm.source_container)" 
                  :key="cell.id" 
                  :value="cell.id"
                >
                  Ячейка {{ cell.id }} - {{ cell.product?.name }} ({{ cell.product?.quantity }} {{ cell.product?.unit }})
                </option>
              </select>
            </div>
          </div>
          
          <!-- Для прихода показываем поле поставщик -->
          <div v-if="localForm.operation_name === 'приход'">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Поставщик <span class="text-red-500">*</span>
            </label>
            <select
              v-model="localForm.source"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Выберите поставщика</option>
              <option v-for="(supplier, index) in suppliers" :key="index" :value="supplier">
                {{ supplier }}
              </option>
            </select>
          </div>
          
          <!-- Куда - для всех операций -->
          <div v-if="localForm.operation_name">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Куда <span class="text-red-500">*</span>
            </label>
            
            <!-- Для перемещения и прихода показываем выбор склада, контейнера и ячейки -->
            <div v-if="['перемещение', 'приход'].includes(localForm.operation_name)" class="space-y-2">
              <select
                v-model="localForm.destination_warehouse"
                @change="updateFormData"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Выберите склад</option>
                <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
                  {{ warehouse.name }}
                </option>
              </select>
  
              <select
                v-if="localForm.destination_warehouse"
                v-model="localForm.destination_container"
                @change="updateFormData"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Выберите контейнер</option>
                <option 
                  v-for="container in getContainers(localForm.destination_warehouse)" 
                  :key="container.id" 
                  :value="container.id"
                >
                  {{ container.name }}
                </option>
              </select>
  
              <select
                v-if="localForm.destination_container"
                v-model="localForm.destination_cell"
                @change="updateFormData"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Выберите ячейку</option>
                <option 
                  v-for="cell in getCells(localForm.destination_warehouse, localForm.destination_container, localForm.operation_name === 'приход')" 
                  :key="cell.id" 
                  :value="cell.id"
                >
                  Ячейка {{ cell.id }} - {{ cell.product ? 'Занята' : 'Свободна' }}
                </option>
              </select>
            </div>
            <select
              v-else
              v-model="localForm.destination"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Выберите назначение</option>
              <option value="Списание">Списание</option>
              <option v-for="(employee, index) in employees" :key="index" :value="`Сотрудник ${employee}`">
                {{ employee }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="flex justify-end gap-2 mt-6">
          <button
            @click="$emit('close')"
            class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Отмена
          </button>
          <button
            @click="$emit('addOperation', localForm)"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            :disabled="!isFormValid"
          >
            Выполнить операцию
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue'
  import { productsData } from '@/data/products'
  import { suppliersData } from '@/data/suppliers'
  import { employeesData } from '@/data/employees'
  
  const props = defineProps({
    show: {
      type: Boolean,
      required: true
    },
    operationForm: {
      type: Object,
      required: true
    },
    selectedWarehouse: {
      type: Object,
      default: null
    },
    selectedContainer: {
      type: Object,
      default: null
    },
    selectedCell: {
      type: Object,
      default: null
    },
    warehouses: {
      type: Array,
      required: true
    },
    operationType: {
      type: String,
      default: null
    }
  })
  
  const emit = defineEmits(['close', 'addOperation'])
  
  // Копия формы операции для локального управления
  const localForm = ref({ ...props.operationForm })
  
  // Обновление локальной формы при изменении внешней
  watch(() => props.operationForm, (newValue) => {
    localForm.value = { ...newValue }
  }, { deep: true })
  
  watch(() => props.operationType, (newValue) => {
    if (newValue) {
      localForm.value.operation_name = newValue
    }
  })
  
  // Данные из импортов
  const products = ref(productsData)
  const suppliers = ref(suppliersData)
  const employees = ref(employeesData)
  
  // Вычисляемый путь источника
  const sourcePath = computed(() => {
    if (props.selectedWarehouse && props.selectedContainer && props.selectedCell) {
      return `${props.selectedWarehouse.name} / ${props.selectedContainer.name} / Ячейка ${props.selectedCell.id}`
    }
    return ''
  })
  
  // Вычисляемый заголовок формы
  const formTitle = computed(() => {
    switch(localForm.value.operation_name) {
      case 'приход': return 'Приход товара на склад'
      case 'списание': return 'Списание товара со склада'
      case 'перемещение': return 'Перемещение товара между ячейками'
      case 'отгрузка': return 'Отгрузка товара'
      default: return 'Новая операция'
    }
  })
  
  // Проверка валидности формы
  const isFormValid = computed(() => {
    const form = localForm.value
    
    // Базовые обязательные поля
    if (!form.operation_name || !form.product_code || !form.quantity || !form.unit) {
      return false
    }
    
    // Специфические поля в зависимости от типа операции
    if (form.operation_name === 'приход') {
      return !!form.source && !!form.destination_warehouse && 
             !!form.destination_container && !!form.destination_cell
    } else if (form.operation_name === 'перемещение') {
      return !!form.source && !!form.destination_warehouse && 
             !!form.destination_container && !!form.destination_cell
    } else if (['списание', 'отгрузка'].includes(form.operation_name)) {
      return !!form.source && !!form.destination
    }
    
    return false
  })
  
  // Обработчик выбора товара
  const handleProductSelect = () => {
    const product = products.value.find(p => p.code === localForm.value.product_code)
    if (product) {
      localForm.value.product_name = product.name
      localForm.value.unit = product.unit
    }
  }
  
  // Обновление данных формы
  const updateFormData = () => {
    // Дополнительная логика обновления зависимых полей
    if (localForm.value.source_warehouse && localForm.value.source_container && localForm.value.source_cell) {
      const warehouse = props.warehouses.find(w => w.id === parseInt(localForm.value.source_warehouse))
      const container = warehouse?.containers.find(c => c.id === parseInt(localForm.value.source_container))
      const cell = container?.cells.find(c => c.id === localForm.value.source_cell)
      
      if (cell?.product) {
        localForm.value.product_code = cell.product.code
        localForm.value.product_name = cell.product.name
        localForm.value.unit = cell.product.unit
      }
    }
  }
  
  // Получение контейнеров для выбранного склада
  const getContainers = (warehouseId) => {
    const warehouse = props.warehouses.find(w => w.id === parseInt(warehouseId))
    return warehouse?.containers || []
  }
  
  // Получение ячеек для выбранного контейнера
  const getCells = (warehouseId, containerId, onlyEmpty = false) => {
    const warehouse = props.warehouses.find(w => w.id === parseInt(warehouseId))
    const container = warehouse?.containers.find(c => c.id === parseInt(containerId))
    
    if (!container) return []
    
    // Если нужны только пустые ячейки (для прихода)
    if (onlyEmpty) {
      return container.cells.filter(cell => !cell.product)
    }
    
    return container.cells
  }
  
  // Получение заполненных ячеек для выбранного контейнера
  const getFilledCells = (warehouseId, containerId) => {
    const warehouse = props.warehouses.find(w => w.id === parseInt(warehouseId))
    const container = warehouse?.containers.find(c => c.id === parseInt(containerId))
    
    if (!container) return []
    
    return container.cells.filter(cell => cell.product)
  }
  </script>