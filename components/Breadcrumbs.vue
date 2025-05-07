<template>
    <div class="flex items-center text-sm text-gray-500 mb-4">
      <button 
        @click="onNavigate('warehouse', null)"
        class="hover:text-blue-600"
      >
        Склады
      </button>
      
      <template v-if="path.warehouse">
        <span class="mx-2">/</span>
        <button
          @click="onNavigate('container', path.warehouse, null)"
          class="hover:text-blue-600"
        >
          {{ path.warehouse.name }}
        </button>
      </template>
      
      <template v-if="path.container">
        <span class="mx-2">/</span>
        <button
          @click="onNavigate('cell', path.warehouse, path.container, null)"
          class="hover:text-blue-600"
        >
          {{ path.container.name }}
        </button>
      </template>
      
      <template v-if="path.cell">
        <span class="mx-2">/</span>
        <span class="text-gray-700">Ячейка {{ path.cell.id }}</span>
      </template>
    </div>
  </template>
  
  <script setup>
  defineProps({
    path: {
      type: Object,
      required: true
    }
  })
  
  const emit = defineEmits(['navigate'])
  
  const onNavigate = (level, warehouse, container, cell) => {
    emit('navigate', level, warehouse, container, cell)
  }
  </script>