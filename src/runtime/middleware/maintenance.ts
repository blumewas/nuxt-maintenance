import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig, checkMaintenanceExclude } from '#imports'

export default defineNuxtRouteMiddleware(async (to, _from) => {
  const config = useRuntimeConfig()

  // If maintenance mode is not enabled, do not redirect
  if (!config.public.maintenance.enabled) {
    return
  }

  if (to.path === '/maintenance') {
    // If the current route is the maintenance page, do not redirect
    return
  }

  const isExcluded = checkMaintenanceExclude(to.path, config.public.maintenance.exclude)

  if (isExcluded) {
    // If the current route is excluded from maintenance mode, do not redirect
    return
  }

  // Redirect to the maintenance page
  return navigateTo('/maintenance')
})
