import { defineConfig } from 'vite';

export default defineConfig({
    // Entry point of your app
    build: {
        rollupOptions: {
            input: 'src/main.js', // Change to your entry point file
        },
    },
    // Specify the index.html file
    publicDir: '/', // Directory where your index.html file is located
});
