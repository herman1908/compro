import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';
export default defineConfig({
    plugins: [react(), tailwindcss()],
    // path relatif supaya bisa dipasang di dalam iframe / subfolder GitHub Pages
    base: './',
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    // Nama file tetap supaya bisa dipasang di index.html statis tanpa rebuild
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            output: {
                entryFileNames: 'testi.js',
                chunkFileNames: 'testi-[name].js',
                assetFileNames: function (info) { var _a; return ((_a = info.name) === null || _a === void 0 ? void 0 : _a.endsWith('.css')) ? 'testi.css' : 'testi-[name][extname]'; },
            },
        },
    },
});
