import { defineNuxtModule, createResolver, extendPages } from '@nuxt/kit'
import type { NuxtPage } from 'nuxt/schema'
import { defu } from 'defu'

// Module options TypeScript interface definition
export interface ModuleOptions {
  /**
   * Enable or disable the maintenance mode.
   * @default false
   * @memberof ModuleOptions
   */
  enabled?: boolean

  /**
   * Exclude specific pages from maintenance mode.
   *
   * @type {string[]}
   * @memberof ModuleOptions
   */
  exclude?: string[]
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-maintenance',
    configKey: 'maintenance',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    if (process.env.NUXT_PUBLIC_MAINTENANCE_ENABLED !== undefined) {
      // If the environment variable is set, use it to determine if maintenance mode is enabled
      options.enabled = process.env.NUXT_PUBLIC_MAINTENANCE_ENABLED === 'true'
    }

    // Add the maintenance mode plugin to the Nuxt runtime configuration
    nuxt.options.runtimeConfig.public.maintenance = defu(nuxt.options.runtimeConfig.public.maintenance, {
      enabled: options.enabled || false,
    })

    // If enabled add the maintenance mode plugin
    extendPages((pages) => {
      pages.push({
        name: 'maintenance',
        path: '/maintenance',
        file: resolver.resolve('./runtime/components/maintenance.vue'),
      })
    })

    nuxt.hook('pages:extend', (pages) => {
      if (!nuxt.options.runtimeConfig.public.maintenance.enabled) {
        // If maintenance mode is not enabled, do not modify the pages
        return
      }

      pages.forEach((page: NuxtPage) => {
        // If the page is excluded, skip it
        if (options.exclude) {
          const isExcluded = options.exclude.some((excludedPath) => {
            if (excludedPath.includes(':')) {
              // Handle dynamic routes
              const regex = new RegExp(`^${excludedPath.replace(/:\w+/g, '[^/]+')}$`)
              return regex.test(page.path)
            }

            return excludedPath === page.path
          })

          if (isExcluded) {
            return
          }
        }

        // Replace the page component with the maintenance component
        page.file = resolver.resolve('./runtime/components/maintenance.vue')
      })
    })
  },
})
