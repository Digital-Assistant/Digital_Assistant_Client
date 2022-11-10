import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import svgrPlugin from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  // minify: false,
  build: {
    outDir: "build",
  },
  resolve: {
    alias: {
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      "fs-extra": require.resolve("fs-extra/"),
      stream: require.resolve("stream-browserify"),
      zlib: require.resolve("browserify-zlib"),
      buffer: require.resolve("buffer/"),
      path: require.resolve("path-browserify"),
      os: require.resolve("os-browserify/browser"),
      url: require.resolve("url/"),
      constants: require.resolve("constants-browserify"),
      assert: require.resolve("assert/"),
      process: require.resolve("process/"),
    },
  },
  define: {
    "process.env": {},
    "process.argv": [],
    "global": {}
  },
  plugins: [
    reactRefresh(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
        // ...svgr options (https://react-svgr.com/docs/options/)
      },
    }),
  ],
});
