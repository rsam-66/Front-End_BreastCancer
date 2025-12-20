import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Imports your index.js from the router folder

const app = createApp(App)

app.use(router) // <--- This line is critical!
app.mount('#app')