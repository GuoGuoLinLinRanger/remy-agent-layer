/**
 * Load a local .env into process.env if one exists (Node 20.12+). Imported first
 * by every entry point. On deployed hosts there's no .env file — the host sets
 * real environment variables and this is a harmless no-op.
 */
try {
  process.loadEnvFile(".env");
} catch {
  // No .env file (using the mock detector, or env vars are set by the host).
}
