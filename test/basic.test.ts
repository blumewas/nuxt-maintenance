import { fileURLToPath } from 'node:url'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('ssr', async () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  await setup({
    runner: 'vitest',
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
    nuxtConfig: {
      maintenance: {
        enabled: true,
        exclude: ['/excluded', '/dynamic/:id'],
      },
    },
  })

  it('renders the maintenance mode page if enabled', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')

    expect(html).toContain('<h1>Maintenance Mode</h1>')

    const html2 = await $fetch('/subpage')
    expect(html2).toContain('<h1>Maintenance Mode</h1>')
  })

  it('does not render the maintenance mode if page is excluded', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/excluded')

    expect(html).not.toContain('<h1>Maintenance Mode</h1>')

    expect(html).toContain('Excluded page')
  })

  it('does not render the maintenance mode if dynamic page is excluded', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/dynamic/123')

    expect(html).not.toContain('<h1>Maintenance Mode</h1>')
    expect(html).toContain('Dynamic Page 123')
  })
})
