import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

import lit from "@astrojs/lit";

// https://astro.build/config
// noinspection JSUnusedGlobalSymbols
export default defineConfig({
    integrations: [svelte(), lit()],
    vite: {
        server: {
            watch: {
                ignored: ['**/target/**']
            }
        }
    },
    server: {
        port: 8080,
    }
});
