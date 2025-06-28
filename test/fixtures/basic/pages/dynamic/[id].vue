<script setup>
const route = useRoute()
</script>

<template>
  <div>
    <h1>Dynamic Page {{ route.params.id }}</h1>
    <p>This is a dynamic page with ID: {{ route.params.id }}</p>
  </div>
</template>
