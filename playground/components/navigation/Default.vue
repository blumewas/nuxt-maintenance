<template>
  <div class="navigation">
    <NuxtLink to="/">
      Home
    </NuxtLink>
    <NuxtLink to="/subpage">
      Subpage
    </NuxtLink>
    <NuxtLink to="/excluded">
      Excluded Page
    </NuxtLink>
    <NuxtLink to="/dynamic/123">
      Dynamic Page
    </NuxtLink>
    <NuxtLink to="/excluded/123">
      Excluded Dynamic Page
    </NuxtLink>
  </div>
</template>

<style scoped>
.navigation {
  display: flex;
  gap: 1rem;
}
.navigation a {
  text-decoration: none;
  color: #007bff;
}
.navigation a:hover {
  text-decoration: underline;
}

/* active */
.navigation a.router-link-active {
  font-weight: bold;
  color: #0056b3;
}
</style>
