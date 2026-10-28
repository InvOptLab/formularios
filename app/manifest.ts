import type { MetadataRoute } from "next";

// Necessário para gerar o arquivo estaticamente com `output: "export"`.
export const dynamic = "force-static";

/**
 * Web App Manifest. Os caminhos são relativos ao próprio manifest para
 * funcionarem também sob o basePath do GitHub Pages (/formularios).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sistema de Formulários",
    short_name: "Sistema de Formulários",
    description:
      "Seleção e priorização de turmas para o processo de atribuição de carga didática do SME/ICMC.",
    start_url: ".",
    scope: ".",
    display: "standalone",
    background_color: "#f6f7fb",
    theme_color: "#1976d2",
    icons: [
      { src: "icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
