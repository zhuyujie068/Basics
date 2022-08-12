# VUE-3

## 生命周期钩子函数

```javascript
import { defineComponent, onUnmounted, onMounted } from "vue";

export default defineComponent({
  setup() {
    console.log("setup");
    // 原vue2.0写法mounted(){'代码'}改为onUnmounted(()=>{'代码'});
    onUnmounted(() => {
      console.log("onUnmounted");
    });
    onMounted(() => {
      console.log("onMounted_1");
    });
    // 可以多次调用...
    onMounted(() => {
      console.log("onMounted_2");
    });
    //.....其他的生命周期钩子函数自己去查一下
  },
  beforeCreate() {
    console.log("beforeCreate");
  },
  created() {
    console.log("created");
  },
});

// 结果为beforeCreate....setup....created....onUnmounted....onMounted_1....onMounted_2
```

## data 定义

### Ref

​ 定义各种类型的数据进行双向绑定...

```javascript
const info_1 = ref(1); // 普通类型
const info_2 = ref({
  // 复杂数据类型
  value: 1,
});
const info_3 = ref([1, 2, 3, 4]); // 复杂数据类型
```

​ 获取 ref 值

```javascript
const info_1 = ref(1);
/**
 * ref获取值
 * 在setup中一定要用 .value 去获取，在template模板中使用则不用，直接info_1就可以拿到
 */
let getInfo_1 = info_1.value;
```

### reactive

​ 只能定义对象类型数据进行双向绑定

```javascript
const info_1 = reactive({
  value: 1,
});
```

​ 获取 reactive 值

```javascript
const info_1 = reactive({
  value: 1,
});
/**
 * reactive获取值
 * 无论在setup还是template模板都可以直接拿到
 */
let getInfo_1 = info_1;
```

### 具体使用场景

```vue
<template>
  {{ viewInfo_1 }}
  <!-- 没有retrun是没办法在模板获取的-->
  {{ viewInfo_2 }}
  <!-- 显示为2 -->
  {{ viewInfo_3 }}
  <!-- 显示为3 -->
  {{ viewInfo_4 }}
  <!-- 显示为4 -->
</template>
<script>
import { defineComponent,ref,reactive} from "vue";
   export default defineComponent({
       setup(){
           let viewInfo_1 = 1; // 定义普通数据
           let viewInfo_2 = 2; // 定义普通数据
           const viewInfo_3 = ref(3); // 定义任何双向绑定数据
           const viewInfo_4 = reactive({ // 定义对象类型双向绑定数据
               value : 4
           });
           retrun {
               // 没有retrun是没办法在模板获取的...
               viewInfo_2,
               viewInfo_3,
               viewInfo_4,
           }
       }
   )}
</script>
```

## watch 使用

```javascript
import {defineComponent,watch,ref,reactive} from "vue";

export default defineComponent({
	const refValue = ref(1);
	const refValue2= ref(2);
	const refValue3 = reactive({
        value : 3
    });
    // 基本用法
    watch(()=>console.log(refValue.value));
	// 指定数据源
    watch(refValue2,(Value2,oldValue)=>{
        console.log(Value2,oldValue);
    });
	// 监听reactive
	watch(() => refValue3.value, (value, oldValue) => {
        console.log(value, oldValue)
    });
	// 监听多个数据源
	watch(
      [refValue,refValue2],
      ([value,value2],[oldValue,oldValue2])=>{
          console.log('------')
      },
      {
        lazy:true, //组件第一次创建不调用
        deep:true, //深度监听
      }
	)
})

```

## 父子传值

```javascript
import {defineComponent} from "vue";

export default defineComponent({
    // 必须在这里定义，下面的setup参数才有相对于的props值
    props: {
        propsValue1:{
            type:Number, // 类型，多类型可以这样写type:[String,Number,Boolean]
            required: true, // 是否必传
            default:1 // 默认值
        }
    },
	setup(props,{ emit }) { // 结构emit进行父子传值，感兴趣可以自己去输出看看第二个参数是什么...
        console.log(props.propsValue1);
        const value_ = 1;
        function(){
			emit("emitValue", value_);
        }
	},
})

// 输出为默认值 1
```

## Refs 获取 Dom 元素

```vue
<template>
  <div ref="domDiv"></div>

  <!-- VUe3是可以有多个根节点的，这样写没问题的 -->
  <div></div>
</template>
<script>
import { defineComponent,ref,onMounted} from "vue";
   export default defineComponent({
       setup(){
           const domDiv = ref(null); // 一定要定义跟ref一样的字段才能获取到相对应Dom
           onMounted(()=>{
			domDiv.value.style.color = "red"
		});
           return{
               domDiv
           }
       }

   )}
</script>
```

## 组件使用

```vue
<template>
  <Mycomponent />
</template>
<script>
import { defineComponent} from "vue";
   import Mycomponent form './Mycomponent.vue'
   export default defineComponent({
       setup(){
       },
       components:{
           Mycomponent
       }
   )}
</script>
```

## nextTick 使用

```javascript
import { nextTick} from "vue";
setup(){
	nextTick(()=>{
    	console.log('nextTick')
	})
}
```

## 路由获取参数

```javascript
// 这里我用URL参数来做例子，路由参数也是同理
import { defineComponent,onMounted} from "vue";
import { useRoute } from "vue-router";
export default defineComponent({
	setup(){
        let params = useRoute().query; // URL参数，一定要写在setup函数第一层，不然则无效
        console.log(params); // {参数1:value1,参数2:value2};
		onMounted(()=>{
            let parmams2 = useRoute() // 在onMounted获取是undefined....
		});
		return{
		}
	}
)}
```

## 指令 v-memo

常用场景：在 v-for 中使用可在数据源修改后对 DOM 的重构速度进行优化

文档：https://v3.cn.vuejs.org/api/directives.html#v-memo

## Style 特性

### 动态 css 样式

```vue
<template>
  <div class="text">hello</div>
</template>

<script>
export default {
  data() {
    return {
      color: "red",
    };
  },
};
</script>

<style>
.text {
  color: v-bind(color);
}
</style>
```

# VUE-3.2 + TS

## setup 单文件组件写法

```vue
<template>
  <div ref="test"></div>
</template>
<script setup lang="ts">
// Vue3.2 script标签写法
/**
 *1.在这里面写的VUE3代码就不需要再retrun返回了...template中可以直接使用
 *2.用setup单文件组件写出来的VUE模块默认是闭合的，其他组件是无法使用ref直接获取
 *3.ref注意项---重点坑...若模板里如果定义了ref，脚本里要写上对应的变量。否则编译后会undefined错误
 *  开发测试可能不会出错，在生产环境中即会报错导致页面打不开
 */
import { ref } from "vue";
// ts写法: const name = ref<类型定义>(默认值);
const test = ref<null | HTMLElement>(null);
</script>
```

## 定义 props/emit 的方法和使用

### props 参数定义和使用

```javascript
import { onMounted } from "vue";
// 基本定义---简单数据类型
const props = defineProps({
    foo:String
});
// 复杂数据类型
interface testStruct{
    name:string;
    value:number;
}; // ts定义一个接口
// 不带默认值
const props = defineProps<{
	testList: testStruct[];
	value: string;
}>();
// 带默认值
const props = withDefaults(defineProps<{
	testList: testStruct[];
	value: string;
}>(), {
	testList:()=>[],
	value: '测试'
});
// ----------------------------------------
// 使用
onMounted(()=>{
    console.log(props.value); // 测试
})
```

### emits 事件定义和使用

```vue
<template>
  <div @click="clickHander(1)">按钮</div>
</template>
<script setup lang="ts">
// 普通定义
const emits = defineEmits(["change", "btnHander"]);
// TS定义写法   ps：其实在TS写法中使用一般普通定义就可以了，很少使用这种写法
const emits = defineEmits<{
  (e: "change"): void;
  (e: "btnHander", id: number): void;
}>();
// 上面按钮点击触发的方法
function clickHander(id: number) {
  // 使用emits
  emits("btnHander", id);
}
</script>
```

## 组件传值

使用 `<script setup>` 的组件是**默认关闭**的，也即通过模板 ref 或者 `$parent` 链获取到的组件的公开实例，不会暴露任何在 `<script setup>` 中声明的绑定。

简单描述：若**父组件**想通过`ref`调用**子组件**或者**子组件**想通过`$parent`调用**父组件**中的**变量和方法** 必须使用以下定义，否则获取过来的 ref 为**空**

子组件

```vue
<template>子组件</template>
<script setup lang="ts">
const ChildrenValue = ref(1);
function ChildrenFun() {
  console.log("我是子组件");
}
// 暴露方法和数据源
defineExpose({
  ChildrenValue,
  ChildrenFun,
});
// 暴露TS定义
export interface API {
  ChildrenValue: number;
  ChildrenFun: Function;
}
</script>
```

父组件

```vue
<template>
  <ChildrenVue ref="ChildrenRef" />
</template>
<script setup lang="ts">
import { ref, nextTick } from "vue";
// 引入子组件，setup单文件组件中，不需要注册组件就可以直接使用
import ChildrenVue, { API as ChildrenAPI } from "./Children";
const ChildrenRef = ref<null | ChildrenAPI>(null);
nextTick(() => {
  if (ChildrenRef.value) {
    ChildrenRef.value.ChildrenFun(); // 输出‘我是子组件’
  }
});
</script>
```

## await

```vue
<script setup>
// 可以直接使用await，编译后会自动识别为async setup()
const post = await fetch(api).then(r => console.log(r));
</script>
```
