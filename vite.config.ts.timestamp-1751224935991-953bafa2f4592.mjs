// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["lucide-react"]
        }
      }
    }
  },
  define: {
    // Ensure environment variables are properly defined for production
    "import.meta.env.VITE_API_URL": JSON.stringify(process.env.VITE_API_URL || "https://your-backend-api.com/api"),
    "import.meta.env.VITE_WS_URL": JSON.stringify(process.env.VITE_WS_URL || "wss://your-backend-api.com")
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICBidWlsZDoge1xuICAgIG91dERpcjogJ2Rpc3QnLFxuICAgIHNvdXJjZW1hcDogZmFsc2UsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIHZlbmRvcjogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3Qtcm91dGVyLWRvbSddLFxuICAgICAgICAgIHVpOiBbJ2x1Y2lkZS1yZWFjdCddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGRlZmluZToge1xuICAgIC8vIEVuc3VyZSBlbnZpcm9ubWVudCB2YXJpYWJsZXMgYXJlIHByb3Blcmx5IGRlZmluZWQgZm9yIHByb2R1Y3Rpb25cbiAgICAnaW1wb3J0Lm1ldGEuZW52LlZJVEVfQVBJX1VSTCc6IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52LlZJVEVfQVBJX1VSTCB8fCAnaHR0cHM6Ly95b3VyLWJhY2tlbmQtYXBpLmNvbS9hcGknKSxcbiAgICAnaW1wb3J0Lm1ldGEuZW52LlZJVEVfV1NfVVJMJzogSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5lbnYuVklURV9XU19VUkwgfHwgJ3dzczovL3lvdXItYmFja2VuZC1hcGkuY29tJyksXG4gIH1cbn0pIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLG9CQUFvQjtBQUN0UCxPQUFPLFdBQVc7QUFHbEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQSxVQUNaLFFBQVEsQ0FBQyxTQUFTLGFBQWEsa0JBQWtCO0FBQUEsVUFDakQsSUFBSSxDQUFDLGNBQWM7QUFBQSxRQUNyQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBO0FBQUEsSUFFTixnQ0FBZ0MsS0FBSyxVQUFVLFFBQVEsSUFBSSxnQkFBZ0Isa0NBQWtDO0FBQUEsSUFDN0csK0JBQStCLEtBQUssVUFBVSxRQUFRLElBQUksZUFBZSw0QkFBNEI7QUFBQSxFQUN2RztBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
