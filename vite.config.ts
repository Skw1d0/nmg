import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    base: "/nmg/",
    plugins: [react()],
    // server: {
    //     proxy: {
    //         '/api-trassen': {
    //             target: 'https://trassenfinder.de',
    //             changeOrigin: true,
    //             rewrite: (path) => path.replace(/^\/api-trassen/, '')
    //         }
    //     }
    // }
})
