import { createApp } from 'vue'
import './style.css'
import router from './router'
import AppWrapper from './AppWrapper.vue'
import directives from './directives'

const app = createApp(AppWrapper)
app.use(router)
app.use(directives)
app.mount('#app')
