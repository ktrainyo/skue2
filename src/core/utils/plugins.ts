import type { App } from "vue";

export function registerPlugins(app: App) {
  const modules = import.meta.glob("/src/plugins/**/index.ts");

  for (const path in modules) {
    modules[path]().then((mod) => {
      const module = mod as { default: (app: App) => void };
      if (typeof module.default === "function") {
        (mod as { default: (app: App) => void }).default(app);
      }
    });
  }
}
