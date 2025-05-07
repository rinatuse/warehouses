<template>
  <div class="bg-gray-100 min-h-screen">
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <h1 class="text-2xl font-bold text-gray-800">Система управления складом</h1>
      </div>
    </div>
    
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="flex border-b border-gray-200 mb-6">
        <NuxtLink 
          to="/" 
          class="py-3 px-6" 
          :class="$route.path === '/' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'"
        >
          <div class="flex items-center gap-2">
            <span>📦</span>
            <span>Склады</span>
          </div>
        </NuxtLink>
        
        <NuxtLink 
          to="/search" 
          class="py-3 px-6" 
          :class="$route.path === '/search' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'"
        >
          <div class="flex items-center gap-2">
            <span>🔍</span>
            <span>Поиск товара</span>
          </div>
        </NuxtLink>
        
        <NuxtLink 
          to="/operations" 
          class="py-3 px-6" 
          :class="$route.path === '/operations' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'"
        >
          <div class="flex items-center gap-2">
            <span>📋</span>
            <span>История операций</span>
          </div>
        </NuxtLink>
      </div>
      
      <slot />
    </div>
  </div>
</template>

<script setup>
</script>