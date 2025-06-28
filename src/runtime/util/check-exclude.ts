export const checkMaintenanceExclude = (toPath: string, exclude: string[] = []): boolean => {
  // If no exclude paths are defined, return false (no exclusion)
  if (!exclude || exclude.length === 0) {
    return false
  }

  // Check if the current route path starts with any of the excluded paths
  return exclude.some((excludedPath: string) => {
    // Normalize both paths to ensure consistent comparison
    const normalizedToPath = toPath.replace(/\/$/, '')
    const normalizedExcludedPath = excludedPath.replace(/\/$/, '')
    return normalizedToPath.startsWith(normalizedExcludedPath)
  })
}
