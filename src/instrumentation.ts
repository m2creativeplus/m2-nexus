export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // @ts-ignore
    await import('newrelic');
    await import('./instrumentation.node');
  }
}
