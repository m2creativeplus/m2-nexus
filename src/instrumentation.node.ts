import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

// =================================================================
// 🛡️ M2 SOVEREIGN OTEL - TRUTH EMITTER
// Configures the Nexus to broadcast traces to Sovereign Observability
// Targets: Arize Phoenix (Local:6006) & Langfuse (Local:3002)
// =================================================================

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'm2-nexus-core',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
    environment: process.env.NODE_ENV,
  }),
  // Exporting to Phoenix for Hallucination & RAG analysis
  traceExporter: new OTLPTraceExporter({
    url: 'http://localhost:6006/v1/traces',
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      // Disable noisy instrumentations
      '@opentelemetry/instrumentation-fs': { enabled: false },
      '@opentelemetry/instrumentation-net': { enabled: false },
    }),
  ],
});

try {
  sdk.start();
  console.log('[SOVEREIGN OTEL] Trace emission activated. Target: Phoenix (6006)');
  
  process.on('SIGTERM', () => {
    sdk.shutdown()
      .then(() => console.log('[SOVEREIGN OTEL] Shutdown complete'))
      .catch((error) => console.error('[SOVEREIGN OTEL] Error shutting down', error))
      .finally(() => process.exit(0));
  });
} catch (error) {
  console.error('[SOVEREIGN OTEL] Initialization failed', error);
}
