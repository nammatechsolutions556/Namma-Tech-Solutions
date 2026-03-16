// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  preview: {
    host: "0.0.0.0",
    port: process.env.PORT,
    allowedHosts: "all"
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: "all"
  }
});
