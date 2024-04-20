// vite.config.ts
import { defineConfig } from "file:///Users/aaroncassar/Dev/sellscale-sight-v2/node_modules/vite/dist/node/index.js";
import react from "file:///Users/aaroncassar/Dev/sellscale-sight-v2/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "/Users/aaroncassar/Dev/sellscale-sight-v2";
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@assets": path.resolve(__vite_injected_original_dirname, "./src/assets"),
      "@atoms": path.resolve(__vite_injected_original_dirname, "./src/components/atoms"),
      "@common": path.resolve(__vite_injected_original_dirname, "./src/components/common"),
      "@drawers": path.resolve(__vite_injected_original_dirname, "./src/components/drawers"),
      "@nav": path.resolve(__vite_injected_original_dirname, "./src/components/nav"),
      "@pages": path.resolve(__vite_injected_original_dirname, "./src/components/pages"),
      "@modals": path.resolve(__vite_injected_original_dirname, "./src/components/modals"),
      "@constants": path.resolve(__vite_injected_original_dirname, "./src/constants"),
      "@contexts": path.resolve(__vite_injected_original_dirname, "./src/contexts"),
      "@utils": path.resolve(__vite_injected_original_dirname, "./src/utils"),
      "@auth": path.resolve(__vite_injected_original_dirname, "./src/auth")
    }
  },
  plugins: [react()]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYWFyb25jYXNzYXIvRGV2L3NlbGxzY2FsZS1zaWdodC12MlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2Fhcm9uY2Fzc2FyL0Rldi9zZWxsc2NhbGUtc2lnaHQtdjIvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2Fhcm9uY2Fzc2FyL0Rldi9zZWxsc2NhbGUtc2lnaHQtdjIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHJlc29sdmU6e1xuICAgIGFsaWFzOntcbiAgICAgICdAYXNzZXRzJyA6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9hc3NldHMnKSxcbiAgICAgICdAYXRvbXMnIDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2NvbXBvbmVudHMvYXRvbXMnKSxcbiAgICAgICdAY29tbW9uJyA6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9jb21wb25lbnRzL2NvbW1vbicpLFxuICAgICAgJ0BkcmF3ZXJzJyA6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9jb21wb25lbnRzL2RyYXdlcnMnKSxcbiAgICAgICdAbmF2JyA6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9jb21wb25lbnRzL25hdicpLFxuICAgICAgJ0BwYWdlcycgOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvY29tcG9uZW50cy9wYWdlcycpLFxuICAgICAgJ0Btb2RhbHMnIDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2NvbXBvbmVudHMvbW9kYWxzJyksXG4gICAgICAnQGNvbnN0YW50cycgOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvY29uc3RhbnRzJyksXG4gICAgICAnQGNvbnRleHRzJyA6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9jb250ZXh0cycpLFxuICAgICAgJ0B1dGlscycgOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvdXRpbHMnKSxcbiAgICAgICdAYXV0aCcgOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvYXV0aCcpLFxuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZTLFNBQVMsb0JBQW9CO0FBQzFVLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFGakIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUTtBQUFBLElBQ04sT0FBTTtBQUFBLE1BQ0osV0FBWSxLQUFLLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQ2xELFVBQVcsS0FBSyxRQUFRLGtDQUFXLHdCQUF3QjtBQUFBLE1BQzNELFdBQVksS0FBSyxRQUFRLGtDQUFXLHlCQUF5QjtBQUFBLE1BQzdELFlBQWEsS0FBSyxRQUFRLGtDQUFXLDBCQUEwQjtBQUFBLE1BQy9ELFFBQVMsS0FBSyxRQUFRLGtDQUFXLHNCQUFzQjtBQUFBLE1BQ3ZELFVBQVcsS0FBSyxRQUFRLGtDQUFXLHdCQUF3QjtBQUFBLE1BQzNELFdBQVksS0FBSyxRQUFRLGtDQUFXLHlCQUF5QjtBQUFBLE1BQzdELGNBQWUsS0FBSyxRQUFRLGtDQUFXLGlCQUFpQjtBQUFBLE1BQ3hELGFBQWMsS0FBSyxRQUFRLGtDQUFXLGdCQUFnQjtBQUFBLE1BQ3RELFVBQVcsS0FBSyxRQUFRLGtDQUFXLGFBQWE7QUFBQSxNQUNoRCxTQUFVLEtBQUssUUFBUSxrQ0FBVyxZQUFZO0FBQUEsSUFDaEQ7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTLENBQUMsTUFBTSxDQUFDO0FBQ25CLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
