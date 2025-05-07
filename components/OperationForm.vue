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
            v-model="formData.operation_name"
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
            v-model="formData.product_code"
            @change="handleProductSelect"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            :disabled="!!selectedProduct"
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
              v-model="formData.quantity"
              class="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
            />
            <span class="p-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-500">
              {{ formData.unit }}
            </span>
          </div>
        </div>
        
        <!-- Откуда - показываем для всех операций кроме прихода -->
        <div v-if="formData.operation_name && formData.operation_name !== 'приход'">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Откуда <span class="text-red-500">*</span>
          </label>
          <input
            v-if="(selectedWarehouse && selectedContainer && selectedProduct)"
            type="text"
            v-model="sourcePath"
            readonly
            class="w-full p-2 bg-gray-50 border border-gray-300 rounded-md"
          />
          <div v-else class="space-y-2">
            <select
              v-model="formData.source_warehouse"
              @change="updateFormData"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Выберите склад</option>
              <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
                {{ warehouse.name }}
              </option>
            </select>

            <select
              v-if="formData.source_warehouse"
              v-model="formData.source_container"
              @change="updateFormData"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Выберите контейнер</option>
              <option 
                v-for="container in getContainers(formData.source_warehouse)" 
                :key="container.id" 
                :value="container.id"
              >
                {{ container.name }}
              </option>
            </select>

            <select
              v-if="formData.source_container"
              v-model="formData.selected_product"
              @change="handleSelectedProductChange"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Выберите товар</option>
              <option 
                v-for="product in getContainerProducts(formData.source_warehouse, formData.source_container)" 
                :key="product.code" 
                :value="product.code"
              >
                {{ product.code }} - {{ product.name }} ({{ product.quantity }} {{ product.unit }})
              </option>
            </select>
          </div>
        </div>
        
        <!-- Для прихода показываем поле поставщик -->
        <div v-if="formData.operation_name === 'приход'">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Поставщик <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.source"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Выберите поставщика</option>
            <option v-for="(supplier, index) in suppliers" :key="index" :value="supplier">
              {{ supplier }}
            </option>
          </select>
        </div>
        
        <!-- Куда - для всех операций -->
        <div v-if="formData.operation_name">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Куда <span class="text-red-500">*</span>
          </label>
          
          <!-- Для перемещения и прихода показываем выбор склада и контейнера -->
          <div v-if="['перемещение', 'приход'].includes(formData.operation_name)" class="space-y-2">
            <select
              v-model="formData.destination_warehouse"
              @change="updateFormData"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Выберите склад</option>
              <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
                {{ warehouse.name }}
              </option>
            </select>

            <select
              v-if="formData.destination_warehouse"
              v-model="formData.destination_container"
              @change="updateFormData"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Выберите контейнер</option>
              <option 
                v-for="container in getContainers(formData.destination_warehouse)" 
                :key="container.id" 
                :value="container.id"
              >
                {{ container.name }}
              </option>
            </select>
          </div>
          <select
            v-else
            v-model="formData.destination"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Выберите назначение</option>
            <option value="Списание">Списание</option>
            <option v-for="(employee, index) in employees" :key="index" :value="employee">
              {{ employee }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- Отладочная информация -->
      <div v-if="DEBUG" class="mt-4 p-2 bg-gray-100 rounded text-xs">
        <p>Валидация формы: {{ isFormValid ? 'Да' : 'Нет' }}</p>
        <p>Причина: {{ validationReason }}</p>
      </div>
      
      <div class="flex justify-end gap-2 mt-6">
        <button
          @click="$emit('close')"
          class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
        >
          Отмена
        </button>
        <button
          @click="submitForm"
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
import { ref, computed, watch, onMounted } from 'vue'
import { productsData } from '@/data/products'
import { suppliersData } from '@/data/suppliers'
import { employeesData } from '@/data/employees'

// Установите в true для отображения отладочной информации
const DEBUG = false

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
  selectedProduct: {
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

// Используем локальную копию формы для работы
const formData = ref({
  product_code: '',
  product_name: '',
  quantity: '',
  unit: '',
  source: '',
  destination: '',
  operation_name: '',
  source_warehouse: '',
  source_container: '',
  selected_product: '',
  destination_warehouse: '',
  destination_container: ''
})

// Инициализация формы при открытии
onMounted(() => {
  initializeForm()
})

// Обновление формы при изменении входных данных
watch(() => props.show, (newValue) => {
  if (newValue) {
    initializeForm()
  }
})

watch(() => props.operationType, (newValue) => {
  if (newValue) {
    formData.value.operation_name = newValue
  }
})

// Инициализация формы данными
function initializeForm() {
  // Копируем базовые поля из входной формы
  Object.assign(formData.value, props.operationForm)
  
  // Если есть выбранный товар
  if (props.selectedProduct) {
    formData.value.product_code = props.selectedProduct.code
    formData.value.product_name = props.selectedProduct.name
    formData.value.unit = props.selectedProduct.unit
    formData.value.quantity = props.selectedProduct.quantity
  }
  
  // Если выбран склад и контейнер, устанавливаем исходное местоположение
  if (props.selectedWarehouse && props.selectedContainer) {
    formData.value.source = `${props.selectedWarehouse.name} / ${props.selectedContainer.name}`
    formData.value.source_warehouse = props.selectedWarehouse.id
    formData.value.source_container = props.selectedContainer.id
  }
  
  // Установка типа операции если передан
  if (props.operationType) {
    formData.value.operation_name = props.operationType
  }
}

// Данные из импортов
const products = ref(productsData)
const suppliers = ref(suppliersData)
const employees = ref(employeesData)

// Вычисляемый путь источника
const sourcePath = computed(() => {
  if (props.selectedWarehouse && props.selectedContainer) {
    if (props.selectedProduct) {
      return `${props.selectedWarehouse.name} / ${props.selectedContainer.name}`
    }
  }
  return ''
})

// Вычисляемый заголовок формы
const formTitle = computed(() => {
  switch(formData.value.operation_name) {
    case 'приход': return 'Приход товара на склад'
    case 'списание': return 'Списание товара со склада'
    case 'перемещение': return 'Перемещение товара между контейнерами'
    case 'отгрузка': return 'Отгрузка товара'
    default: return 'Новая операция'
  }
})

// Причина невалидности формы для отладки
const validationReason = computed(() => {
  const form = formData.value
  
  if (!form.operation_name) return 'Не выбран тип операции'
  if (!form.product_code) return 'Не выбран товар'
  if (!form.quantity) return 'Не указано количество'
  if (!form.unit) return 'Не указана единица измерения'
  
  if (form.operation_name === 'приход') {
    if (!form.source) return 'Не выбран поставщик'
    if (!form.destination_warehouse) return 'Не выбран склад назначения'
    if (!form.destination_container) return 'Не выбран контейнер назначения'
  } 
  else if (form.operation_name === 'перемещение') {
    const hasSourcePath = !!sourcePath.value
    const hasSourceSelected = !!form.source_warehouse && !!form.source_container
    
    if (!hasSourcePath && !hasSourceSelected) return 'Не указан источник'
    if (!hasSourcePath && !form.selected_product && !form.source) return 'Не выбран товар источника'
    if (!form.destination_warehouse) return 'Не выбран склад назначения'
    if (!form.destination_container) return 'Не выбран контейнер назначения'
  } 
  else if (['списание', 'отгрузка'].includes(form.operation_name)) {
    const hasSourcePath = !!sourcePath.value
    const hasSourceSelected = !!form.source_warehouse && !!form.source_container
    
    if (!hasSourcePath && !hasSourceSelected) return 'Не указан источник'
    if (!hasSourcePath && !form.source_container) return 'Не выбран контейнер источника'
    if (!form.destination && !form.source) return 'Не выбрано назначение списания/отгрузки'
  }
  
  return 'Форма валидна'
})

// Проверка валидности формы
const isFormValid = computed(() => {
  const form = formData.value
  
  // Базовые обязательные поля
  if (!form.operation_name || !form.product_code || !form.quantity || !form.unit) {
    return false
  }
  
  // Специфические поля в зависимости от типа операции
  if (form.operation_name === 'приход') {
    return !!form.source && !!form.destination_warehouse && !!form.destination_container
  } 
  else if (form.operation_name === 'перемещение') {
    // Проверяем либо sourcePath (если выбран товар), либо выбранные из списков значения
    const hasSourcePath = !!sourcePath.value
    const hasSourceSelected = !!form.source_warehouse && !!form.source_container
    
    return (hasSourcePath || hasSourceSelected) && 
           !!form.destination_warehouse && !!form.destination_container
  } 
  else if (['списание', 'отгрузка'].includes(form.operation_name)) {
    // Упрощенная валидация для отгрузки/списания
    const hasSourcePath = !!sourcePath.value
    const hasSourceSelected = !!form.source_warehouse
    
    return (hasSourcePath || hasSourceSelected) && !!form.destination
  }
  
  return false
})

// Обработчик выбора товара
function handleProductSelect() {
  const product = products.value.find(p => p.code === formData.value.product_code)
  if (product) {
    formData.value.product_name = product.name
    formData.value.unit = product.unit
  }
}

// Обработчик выбора товара из контейнера источника
function handleSelectedProductChange() {
  if (formData.value.selected_product) {
    const warehouse = props.warehouses.find(w => w.id === parseInt(formData.value.source_warehouse))
    const container = warehouse?.containers.find(c => c.id === parseInt(formData.value.source_container))
    
    if (container) {
      const product = container.products.find(p => p.code === formData.value.selected_product)
      if (product) {
        formData.value.product_code = product.code
        formData.value.product_name = product.name
        formData.value.unit = product.unit
        formData.value.quantity = product.quantity
      }
    }
  }
}

// Обновление данных формы
function updateFormData() {
  // При необходимости можно добавить логику
}

// Получение контейнеров для выбранного склада
function getContainers(warehouseId) {
  const warehouse = props.warehouses.find(w => w.id === parseInt(warehouseId))
  return warehouse?.containers || []
}

// Получение товаров из контейнера
function getContainerProducts(warehouseId, containerId) {
  const warehouse = props.warehouses.find(w => w.id === parseInt(warehouseId))
  const container = warehouse?.containers.find(c => c.id === parseInt(containerId))
  
  if (!container) return []
  
  return container.products || []
}

// Отправка формы при нажатии на кнопку
function submitForm() {
  if (!isFormValid.value) return
  
  // Создаем объект для отправки с необходимыми полями
  const formToSubmit = {
    product_code: formData.value.product_code,
    product_name: formData.value.product_name,
    quantity: formData.value.quantity,
    unit: formData.value.unit,
    operation_name: formData.value.operation_name,
    
    // Для источника используем либо прямой путь, либо выбранные значения
    source: sourcePath.value || 
            (formData.value.source_warehouse ? 
              getWarehouseName(formData.value.source_warehouse) : formData.value.source),
    
    // Для назначения используем разные поля в зависимости от типа операции
    destination: ['перемещение', 'приход'].includes(formData.value.operation_name) 
      ? `${getWarehouseName(formData.value.destination_warehouse)} / ${getContainerName(formData.value.destination_warehouse, formData.value.destination_container)}` 
      : formData.value.destination,
    
    // Добавляем идентификаторы для обработки операций
    source_warehouse: formData.value.source_warehouse || (props.selectedWarehouse ? props.selectedWarehouse.id : null),
    source_container: formData.value.source_container || (props.selectedContainer ? props.selectedContainer.id : null),
    destination_warehouse: formData.value.destination_warehouse,
    destination_container: formData.value.destination_container
  }
  
  // Отправляем форму родительскому компоненту
  emit('addOperation', formToSubmit)
}

// Вспомогательные функции для получения имен
function getWarehouseName(warehouseId) {
  const warehouse = props.warehouses.find(w => w.id === parseInt(warehouseId))
  return warehouse?.name || ''
}

function getContainerName(warehouseId, containerId) {
  const warehouse = props.warehouses.find(w => w.id === parseInt(warehouseId))
  const container = warehouse?.containers.find(c => c.id === parseInt(containerId))
  return container?.name || ''
}
</script>