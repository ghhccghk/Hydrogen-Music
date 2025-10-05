import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: './', // 生成相对路径
  plugins: [
    vue(),

    // ✅ 启用 gzip 压缩（减少打包后 dist 大小）
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // 只压缩大于 10KB 的文件
      deleteOriginFile: false // 保留原始文件
    }),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },

  build: {
    outDir: 'dist',
    sourcemap: false, // ✅ 禁用 map 文件，节省 20% 体积
    manifest: true,
    chunkSizeWarningLimit: 1000, // 不报警告
    cssCodeSplit: true, // ✅ 拆分 CSS
    minify: 'terser', // ✅ 使用 Terser 高压缩率
    terserOptions: {
      compress: {
        drop_console: true,   // ✅ 删除 console
        drop_debugger: true,  // ✅ 删除 debugger
        pure_funcs: ['console.log'] // 彻底移除 log 调用
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        // ✅ 控制文件名格式，让 Electron builder 打包更整洁
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
            return 'assets/img/[name]-[hash][extname]'
          }
          if (/\.css$/.test(name ?? '')) {
            return 'assets/css/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  },

  optimizeDeps: {
    exclude: [] // 有冲突的依赖可以加进来避免预构建
  }
}))
