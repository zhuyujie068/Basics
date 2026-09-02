### vuex与pinia区别：
>1.支持选项式api和组合式api写法
>2.pinia没有mutations，只有：state、getters、actions
>3.pinia分模块不需要modules（之前vuex分模块需要modules）
>4.TypeScript支持很好
>5.自动化代码拆分
>6.pinia体积更小（性能更好）
>7.pinia支持tsx语法

### Pinia 常用函数教程

在 Pinia 中，除了定义 Store 之外，我们经常需要操作 State 或者解构数据，这时 `$patch`、`$reset` 和 `storeToRefs` 就非常有用。

假设我们有一个简单的计数器 Store：

```javascript
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: 'Eduardo',
    items: []
  }),
  actions: {
    increment() {
      this.count++
    }
  }
})
```

---
#### 1. `$patch`：批量修改 State

虽然你可以直接修改 State（例如 `store.count++`），但 `$patch` 允许你同时修改多个属性，或者进行更复杂的修改。

**用法一：传入对象（推荐用于简单修改）**
这是最常用的方式，适合同时更新多个字段。

```javascript
const store = useCounterStore()

store.$patch({
  count: store.count + 1,
  name: 'Alex',
})
```

**用法二：传入函数（推荐用于数组或复杂逻辑）**
当需要基于旧值进行修改（比如往数组 push 元素）时，函数写法性能更好，因为它不会像对象写法那样替换整个数组。

```javascript
store.$patch((state) => {
  state.items.push({ name: 'shoes', quantity: 1 })
  state.hasChanged = true
})
```

---

#### 2. `$reset`：重置 State

`$reset()` 方法可以将 Store 的 State 重置为初始状态（即 `state` 函数返回的默认对象）。

> **注意**：`$reset()` 仅在 **Option Stores**（选项式写法）中原生支持。如果你使用的是 **Setup Stores**（组合式写法，即 `defineStore` 第二个参数是函数），需要自己实现 reset 逻辑或使用插件。

**用法：**

```javascript
const store = useCounterStore()

// 将 count 重置为 0，name 重置为 'Eduardo'，items 重置为 []
store.$reset()
```

---

#### 3. `storeToRefs`：解构并保持响应式

这是 Pinia 中最容易被忽略但最重要的函数之一。
如果你直接从 store 中解构属性，它们会**失去响应式**。

**错误写法（失去响应式）：**
```javascript
const store = useCounterStore()
// ❌ 这样做 count 和 name 只是普通的变量，store 变化时它们不会更新
const { count, name } = store 
```

**正确写法（使用 `storeToRefs`）：**
`storeToRefs` 会将 state 和 getters 转换为 ref，但**不会**转换 actions（actions 可以直接解构）。

```javascript
import { storeToRefs } from 'pinia'

const store = useCounterStore()

// ✅ count 和 name 现在是响应式的 ref
const { count, name } = storeToRefs(store)

// actions 可以直接解构，不需要 storeToRefs
const { increment } = store
```

---

#### 4. 其他常用函数（进阶）

*   **`$subscribe`**：监听 State 的变化。类似于 Vue 的 `watch`，但它是 patch 级别的（一次 `$patch` 只触发一次）。
    ```javascript
    store.$subscribe((mutation, state) => {
      console.log('mutation type:', mutation.type)
      console.log('new count:', state.count)
      
      // 可以在这里做一些本地存储同步
      localStorage.setItem('cart', JSON.stringify(state))
    })
    ```

*   **`$onAction`**：监听 Action 的调用。可以在 action 执行前、后或出错时运行代码。
    ```javascript
    store.$onAction(({
      name, // action 名称
      store, // store 实例
      args, // 传递给 action 的参数
      after, // action 返回或 resolve 后的钩子
      onError // action 抛出错误时的钩子
    }) => {
      console.log(`Start action "${name}"`)
      
      after((result) => {
        console.log(`Action "${name}" finished`)
      })
    })
    ```

#### 总结

| 函数 | 作用 | 适用场景 |
| :--- | :--- | :--- |
| **`$patch`** | 批量修改 State | 需要同时修改多个状态，或修改数组/集合时。 |
| **`$reset`** | 重置 State | 表单重置、用户登出清理数据（仅限 Option Stores）。 |
| **`storeToRefs`** | 保持响应式解构 | 在组件中解构 store 的 state 或 getters 时必用。 |
| **`$subscribe`** | 监听 State | 数据持久化、调试、状态同步。 |

---
---

### 持久化

Pinia 本身不提供持久化功能，但可以使用 `pinia-plugin-persistedstate` 插件来实现状态持久化。

#### 1. 安装插件

```bash
npm install pinia-plugin-persistedstate
# 或者使用 yarn
yarn add pinia-plugin-persistedstate
# 或者使用 pnpm
pnpm add pinia-plugin-persistedstate
```

#### 2. 配置插件

在创建 Pinia 实例时注册插件：

```javascript
// main.js 或 main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.mount('#app')
```

#### 3. 在 Store 中启用持久化

在定义 Store 时，添加 `persist` 配置项：

```javascript
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: 'Eduardo',
    items: []
  }),
  actions: {
    increment() {
      this.count++
    }
  },
  // 启用持久化
  persist: true
})
```

#### 4. 自定义持久化配置

可以通过 `persist` 选项进行更精细的配置：

```javascript
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: 'Eduardo',
    items: []
  }),
  actions: {
    increment() {
      this.count++
    }
  },
  persist: {
    // 存储的键名，默认为 store 的 id
    key: 'counter-store',
    // 存储的位置，默认为 localStorage
    storage: localStorage, // 可以是 sessionStorage
    // 只持久化指定的 state 字段
    paths: ['count', 'name'], // 不包括 items
    // 自定义序列化和反序列化函数
    serializer: {
      serialize: (value) => JSON.stringify(value),
      deserialize: (value) => JSON.parse(value)
    }
  }
})
```

#### 5. 组合式 API 中的持久化

在组合式 API 中使用持久化：

```javascript
// stores/useCounter.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const name = ref('Eduardo')
  const items = ref([])

  const increment = () => count.value++
  const doubleCount = computed(() => count.value * 2)

  return {
    count,
    name,
    items,
    increment,
    doubleCount
  }
}, {
  // 启用持久化
  persist: true
})
```

---

### Pinia 分模块教程

在 Pinia 中，分模块非常简单，不需要像 Vuex 那样使用 `modules`。每个 Store 本身就是一个独立的模块。

#### 1. 创建多个 Store（模块）

只需要创建多个 Store 文件即可：

```javascript
// stores/user.js - 用户模块
export const useUserStore = defineStore('user', {
  state: () => ({
    id: null,
    name: '',
    email: ''
  }),
  actions: {
    setUser(user) {
      this.id = user.id
      this.name = user.name
      this.email = user.email
    },
    logout() {
      this.id = null
      this.name = ''
      this.email = ''
    }
  }
})
```

```javascript
// stores/cart.js - 购物车模块
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    total: 0
  }),
  getters: {
    itemCount: (state) => state.items.length,
    isEmpty: (state) => state.items.length === 0
  },
  actions: {
    addItem(item) {
      this.items.push(item)
      this.calculateTotal()
    },
    removeItem(itemId) {
      this.items = this.items.filter(item => item.id !== itemId)
      this.calculateTotal()
    },
    calculateTotal() {
      this.total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    clearCart() {
      this.items = []
      this.total = 0
    }
  }
})
```

```javascript
// stores/settings.js - 设置模块
export const useSettingsStore = defineStore('settings', {
  state: () => ({
    theme: 'light',
    language: 'zh-CN',
    notifications: true
  }),
  actions: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
    },
    setLanguage(lang) {
      this.language = lang
    },
    toggleNotifications() {
      this.notifications = !this.notifications
    }
  }
})
```

#### 2. 在组件中使用多个模块

在组件中，可以直接导入并使用所需的 Store：

```javascript
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useSettingsStore } from '@/stores/settings'

export default {
  setup() {
    const userStore = useUserStore()
    const cartStore = useCartStore()
    const settingsStore = useSettingsStore()

    // 使用各个 Store
    const handleAddToCart = (product) => {
      cartStore.addItem({
        ...product,
        quantity: 1
      })
    }

    const handleLogout = () => {
      userStore.logout()
      cartStore.clearCart()
    }

    return {
      userStore,
      cartStore,
      settingsStore,
      handleAddToCart,
      handleLogout
    }
  }
}
```

在组合式 API 中使用：

```vue
<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useSettingsStore } from '@/stores/settings'

const userStore = useUserStore()
const cartStore = useCartStore()
const settingsStore = useSettingsStore()

// 解构并保持响应式
const { id, name, email } = storeToRefs(userStore)
const { items, total, itemCount } = storeToRefs(cartStore)
const { theme, notifications } = storeToRefs(settingsStore)

// 使用 actions
const { setUser, logout } = userStore
const { addItem, clearCart } = cartStore
const { toggleTheme } = settingsStore
</script>
```

#### 3. Store 之间的通信

在 Pinia 中，Store 可以直接相互调用：

```javascript
// stores/cart.js
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    total: 0
  }),
  actions: {
    addItem(item) {
      this.items.push(item)
      this.calculateTotal()
      
      // 调用 userStore 的 action
      const userStore = useUserStore()
      userStore.addToRecentViews(item)
    }
  }
})
```

#### 4. 模块化的最佳实践

1. **按功能划分模块**：每个模块负责一个特定的功能领域（用户、购物车、设置等）
2. **命名规范**：使用清晰的命名，如 `useUserStore`、`useCartStore`
3. **合理拆分**：不要创建过多过小的模块，保持模块的职责单一
4. **避免循环依赖**：尽量避免模块之间的循环调用
5. **统一导出**：可以在一个入口文件中导出所有 Store：

```javascript
// stores/index.js
export * from './user'
export * from './cart'
export * from './settings'
```

然后在组件中统一导入：

```javascript
import { useUserStore, useCartStore, useSettingsStore } from '@/stores'
```
