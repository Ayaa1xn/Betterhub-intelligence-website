import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const tunnelUrl = readTunnelUrl(env.DEV_PUBLIC_URL);
  const allowedHosts = getAllowedHosts(env.DEV_ALLOWED_HOSTS, tunnelUrl?.hostname);
  const hmr = tunnelUrl
    ? {
        protocol: tunnelUrl.protocol === 'https:' ? 'wss' : 'ws',
        host: tunnelUrl.hostname,
        clientPort: tunnelUrl.port
          ? Number(tunnelUrl.port)
          : tunnelUrl.protocol === 'https:'
            ? 443
            : 80,
      }
    : undefined;

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      allowedHosts,
      hmr,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:3001',
          changeOrigin: true,
        },
        '/uploads': {
          target: 'http://127.0.0.1:3001',
          changeOrigin: true,
        },
      },
    },
    preview: {
      host: '0.0.0.0',
      allowedHosts,
    },
  };
});

function readTunnelUrl(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) {
    return null;
  }

  try {
    return new URL(trimmed);
  } catch {
    return null;
  }
}

function getAllowedHosts(value: string | undefined, tunnelHost?: string) {
  const hosts = new Set<string>();

  for (const item of (value || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)) {
    hosts.add(item);
  }

  if (tunnelHost) {
    hosts.add(tunnelHost);
  }

  return [...hosts];
}
