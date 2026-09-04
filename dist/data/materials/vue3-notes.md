# Vue 3 学习笔记

## 1. 组合式 API (Composition API)

Vue 3 引入了组合式 API，这是一种更灵活的方式来组织组件逻辑。

### setup 函数

```vue
<script setup>
import { ref, computed, onMounted } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)

function increment() {
  count.value++
}

onMounted(() => {
  console.log('组件已挂载')
})
</script>
```

### 响应式核心

- `ref()` - 创建基本类型的响应式数据
- `reactive()` - 创建对象类型的响应式数据
- `computed()` - 计算属性
- `watch()` - 侦听器

## 2. 模板语法

### 插值表达式

```html
{{ message }}
{{ count + 1 }}
{{ ok ? '是' : '否' }}
```

### 指令

```html
<!-- 条件渲染 -->
<div v-if="visible">可见</div>
<div v-else>不可见</div>

<!-- 列表渲染 -->
<li v-for="item in list" :key="item.id">{{ item.name }}</li>

<!-- 事件绑定 -->
<button @click="handleClick">点击</button>

<!-- 双向绑定 -->
<input v-model="text" />
```

## 3. 生命周期

| 选项式 API | 组合式 API |
|-----------|-----------|
| beforeCreate | 不需要 |
| created | 不需要 |
| beforeMount | onBeforeMount |
| mounted | onMounted |
| beforeUpdate | onBeforeUpdate |
| updated | onUpdated |
| beforeUnmount | onBeforeUnmount |
| unmounted | onUnmounted |

## 4. 常用技巧

### 父传子 - defineProps

```vue
<!-- 子组件 -->
<script setup>
const props = defineProps({
  title: String,
  count: { type: Number, default: 0 }
})
</script>
```

### 子传父 - defineEmits

```vue
<!-- 子组件 -->
<script setup>
const emit = defineEmits(['update', 'delete'])

function handleSave() {
  emit('update', { id: 1, name: 'test' })
}
</script>
```

## 5. 学习资源

- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Vue 3 迁移指南](https://cn-migration.vuejs.org/)
