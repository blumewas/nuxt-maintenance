import { fileURLToPath } from 'node:url'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('environment configuration', async () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  // Set the environment variable to enable maintenance mode
  vi.stubEnv('NUXT_PUBLIC_MAINTENANCE_ENABLED', 'true')

  await setup({
    runner: 'vitest',
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('renders the maintenance mode page if environment variable is set', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')

    expect(html).toContain('<h1>Maintenance Mode</h1>')
  })
})
