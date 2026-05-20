import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel({ serviceName: 'm2-nexus-sovereign-os' });
}
