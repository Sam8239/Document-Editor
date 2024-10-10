import { defineConfig } from "vite";

export default defineConfig({
    define: { "process.env": {} },
    root: "./src",
    build: {
        lib: {
            entry: "./components/DocumentEditor.js",
            name: "DocumentEditor",
            fileName: (format) => `document-editor.${format}.js`,
            formats: ["es", "umd"],
        },
        rollupOptions: {
            inlineDynamicImports: false,
        },
        minify: true,
    },
    server: { port: 3000 },
});
