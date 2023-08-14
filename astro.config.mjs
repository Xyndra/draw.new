import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

// https://astro.build/config
// noinspection JSUnusedGlobalSymbols
export default defineConfig({
    integrations: [svelte()],
    vite: {
        server: {
            watch: {
                ignored: ['**/target/**']
            }
        }
    },
    server: {
        port: 8080,
        host: true,
    }
});
