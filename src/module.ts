import { addImports, addRouteMiddleware, createResolver, defineNuxtModule, extendPages } from '@nuxt/kit'
import type { NuxtPage } from 'nuxt/schema'
import { defu } from 'defu'
import { checkMaintenanceExclude } from './runtime/util/check-exclude'
import path from 'node:path'

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

  /**
   * The mode of the maintenance page.
   * - `override`: Replaces the page component with the maintenance component.
   * - `redirect`: Redirects to the maintenance page via middleware.
   *
   * @default 'override'
   * @memberof ModuleOptions
   */
  mode?: 'override' | 'redirect'

  /**
   * Override options for the maintenance mode.
   *
   * @memberof ModuleOptions
   */
  custom?: {
    /**
     * The path to the maintenance page component.
     *
     * @type {string}
     */
    page?: string

    /**
     * The path to the middleware that handles the maintenance mode.
     *
     * @type {string}
     */
    middleware?: string
  }
}

/**
 * Normalizes the module options by merging user-defined options with default values.
 *
 * @param {ModuleOptions} options
 * @return {*}  {ModuleOptions}
 */
function getNormalizedOptions(options: ModuleOptions): ModuleOptions {
  const defaultOptions: ModuleOptions = {
    enabled: false,
    mode: 'override',
  }

  const envOptions: ModuleOptions = {
    enabled: process.env.NUXT_PUBLIC_MAINTENANCE_ENABLED === 'true',
  }

  // Merge user options with environment options and default options
  return defu(options, envOptions, defaultOptions)
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

    // Merge user options with default options
    options = getNormalizedOptions(options)

    // Add the maintenance mode plugin to the Nuxt runtime configuration
    nuxt.options.runtimeConfig.public.maintenance = defu(nuxt.options.runtimeConfig.public.maintenance, {
      enabled: options.enabled || false,
      exclude: options.exclude,
    })

    // Add checkMaintenanceExclude utility to the Nuxt runtime configuration
    addImports({
      name: 'checkMaintenanceExclude',
      from: resolver.resolve('./runtime/util/check-exclude'),
    })

    const appRoot = nuxt.options.rootDir

    const maintenancePagePath = options.custom?.page ? resolver.resolve(path.join(appRoot, options.custom?.page)) : resolver.resolve('./runtime/components/maintenance.vue')

    // If maintenance mode is 'redirect', add the middleware
    if (options.mode === 'redirect') {
      // Add the maintenance page to the pages
      extendPages((pages) => {
        pages.push({
          name: 'maintenance',
          path: '/maintenance',
          file: maintenancePagePath,
        })
      })

      const middlewarePath = options.custom?.middleware ? resolver.resolve(path.join(appRoot, options.custom?.middleware)) : resolver.resolve('./runtime/middleware/maintenance.ts')

      // Add the maintenance middleware to the Nuxt application
      addRouteMiddleware({
        name: 'maintenance',
        path: middlewarePath,
        global: true,
      }, { prepend: true })

      return
    }

    nuxt.hook('pages:extend', (pages) => {
      if (!nuxt.options.runtimeConfig.public.maintenance.enabled) {
        // If maintenance mode is not enabled, do not modify the pages
        return
      }

      pages.forEach((page: NuxtPage) => {
        // If the page is excluded, skip it
        if (options.exclude) {
          const isExcluded = checkMaintenanceExclude(page.path, options.exclude)

          if (isExcluded) {
            return
          }
        }

        // Replace the page component with the maintenance component
        page.file = maintenancePagePath
      })
    })
  },
})
