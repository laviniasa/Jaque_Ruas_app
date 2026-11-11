import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // O service worker do app precisa ser sempre buscado de novo,
        // para as alunas receberem atualizações.
        source: "/app/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/app" },
        ],
      },
    ];
  },
};

export default nextConfig;
