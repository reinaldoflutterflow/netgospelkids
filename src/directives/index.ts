import type { App } from 'vue';
import { vImageRetry } from './imageRetry';

export default {
  install(app: App) {
    // Registra a diretiva v-image-retry
    app.directive('image-retry', vImageRetry);
  }
};
