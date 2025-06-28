<script setup>
const config = useRuntimeConfig()

console.log(config)
</script>

<template>
  <div>
    Index Page

    <NuxtLink to="/subpage">Go to Subpage</NuxtLink>
  </div>
</template>
