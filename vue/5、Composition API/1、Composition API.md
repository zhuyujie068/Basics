# composition API 优势
    1.比 Vue 2 的更加简洁
    2.比 Vue 2 更加高内聚低耦合
    3.与 TypeScript 的结合也非常渐进

# Setup 
    Setup 在 created 实例被完全初始化之前 执行,所以 setup 中不能使用 this

```JavaScript
    const app=Vue.createApp({
        template: ` 
           <div @click="handleClick">{{name}}</div>
        `,
        // props 外部组件传递过来的内容，context 指的是上下文
        setup(props,context){
            // return 出去到内容，会暴露在外面，可以直接访问
            return{
                name:'zyj',
                handleClick:()=>{
                    alert(123)
                }
            }
        }
    });

    const vm =app.mount('#root')
```

## context 参数详解

```JavaScript
    const app = Vue.createApp({
        template: ` <child app='app' /> `,
        methods:{
            handleChange(){
                alert('change');
            }
        },
        template:`<child @change="handleChange">变更</child>`
    });

    app.component('child',{
        template:`<div @change="handleClick">点击</div>`,
        setup(props,context){
            const {attrs,slots,emit}=context;

            console.log(attrs); // 父组件 传递过来的 None-Props 属性  输出 ==> {app:app}
            console.log(slots) // 父组件 传递过来的 插槽，slots.default() 获取默认插槽

            function handleClick(){
                emit('change') // 触发 父组件 change 事件
            } 
 
            return {}
        },


        // 不使用  setup 的用法
        /*
             mounted(){
                this.$emit('change')    // 触发 父组件 change 事件
                console.log(this.$slots)    // 获取 父组件 传递的 插槽
            }
        */

    })

    const vm =app.mount('#root')
```



# ref、reactive 响应式引用 的 用法 和 原理
        将基础类型、非基础类型 处理成 响应式引用 ，成为 响应式引用  的数据类型 当值发生变化，页面也会动态的去变化，修改响应式数据是不会影响到原始数据。

        原理，通过 proxy 对数据进行封装，当数据变化时，触发模板等内容的更新

        通过 ref、reactive 响应式引用，可以 代替 在 data(){return{  }} 中声明 属性

## ref 处理基础类型的数据
```JavaScript
    const app=Vue.createApp({
        // 4、 在使用 ref( xxx ) 处理过的 数据，不能 xxx.value 去使用，直接 xxx 就可以了（因为 vue 在做模板处理的时候会做一个转化）
        template: ` 
           <div>{{name}}</div>
        `,
        setup(props,context){
            const { ref } = Vue; // 1、 从 Vue 中 获取 ref

            // 2、proxy => 'dell' 变成 proxy({value:'dell'}) 这样的一个响应式引用（因为 双向绑定 proxy 在 js 中只支持 传入对象这种类型，所以 vue 底层在处理 基础类型 时 会将其变成 对象类型）
            // 3、使用 ref( xxx ) 处理 xxx，需要 使用 xxx.value 去对数据的 修改  
            let name=ref('zyj');

            setTimeout(()=>{
                name.value='lee'
            },2000)

            return{ name }
        }
    });

    const vm =app.mount('#root')
```


## reactive 处理非基础类型的数据

       reactive() 将 引用类型 处理成为 响应式引用 如果将其 进行 解构 的值放在 页面上是不会具备 响应式 。需要先将 对象 通过 reactive() 处理 成 响应式引用 再通过 toRefs() 对其进行处理 后 对 其进行 解构 放在 页面上才具备响应式（props 是响应式的，使用 ES6 解构，它会消除 prop 的响应性，如果需要解构需要用 toRefs）

```JavaScript
    const app=Vue.createApp({
        template: ` 
           <div>{{ nameObj.name }}</div>

           <div>{{ ageArray[0] }}</div>
        `,
        setup(props,context){
            const { reactive } = Vue; // 1、从 Vue 中 获取 reactive

            const nameObj = reactive({ name:'zyj' });
            const ageArray = reactive([18])

            setTimeout(() => {
                nameObj.name ='lee'

                ageArray[0] = 23;
            },2000)

            return { nameObj , ageArray }
        }
    });

    const vm =app.mount('#root')
```



# readonly 只读
        传入 ref 或 reactive 对象, 并返回一个原始对象的只读代理,对象内部任何嵌套的属性也都是只读的。
        传入普通对象等也返回只读代理
        传入 普通数值 或 字符串 不能 变成只读

```JavaScript
    const app=Vue.createApp({
        template: ` 
           <div>{{ copyAgeArray[0] }}</div>
        `,
        setup(props,context){
            const { reactive,readonly } = Vue;

            const ageArray = reactive([18]) 

            const copyAgeArray=readonly(ageArray) // 将其处理成为 只读

            setTimeout(() => {
                ageArray[0] = 23; // 修改的时候会进行 警告
            },2000)

            return { ageArray,copyAgeArray }
        }
    });

    const vm =app.mount('#root')
```


# toRef
        使用 toRef 将某个对象中的属性变成响应式数据，修改响应式数据是会影响到原始数据的。但是需要注意，如果修改通过 toRef 创建的响应式数据，并不会触发 UI 界面的更新。所以，toRef 的本质是引用，与原始数据有关联。( toRef 一次仅能设置一个数据)

```JavaScript
    setup(){
        let obj = {name : 'zyj', age : 18};
        let newObj= toRef(obj, 'name'); // 当 传入的 第二个属性 在对象中没有，toRef 会 以这个属性名生成 空值，的键值对
        setTimeout(()=>{
            newObj.value = 'lee';
            console.log(obj,newObj)
        })
        return {newObj,change}
      }
```

## ref和toRef的区别  
        1、 ref本质是拷贝，修改响应式数据不会影响原始数据；toRef的本质是引用关系，修改响应式数据会影响原始数据
        2、 ref数据发生改变，界面会自动更新；toRef当数据发生改变是，界面不会自动更新
        3、 toRef传参与ref不同；toRef接收两个参数，第一个参数是哪个对象，第二个参数是对象的哪个属性



# toRefs
        希望将对象的多个属性都变成响应式数据，并且要求响应式数据和原始数据关联，并且更新响应式数据的时候不更新界面，就可以使用 toRefs，用于批量设置多个数据为响应式数据.

```JavaScript
    const app=Vue.createApp({
        template: ` 
           <div>{{ name }}</div>
        `,
        setup(props,context){
            const { reactive,toRefs } = Vue;

            const nameObj = reactive({ name:'zyj', age:18 });

            // 需要先将 对象 通过 reactive() 处理 成 响应式引用 再通过 toRefs() 对其进行处理 后 对 其进行 解构 放在 页面上才具备响应式
            //  toRefs 将 proxy({name:'zyj',age:18}) 转换成 { name:proxy({value:'zyj'}),age:proxy({value:18}) }
            const { name } = toRefs(nameObj)

            setTimeout(() => {
                name.value ='lee'
            },2000)
            
            return { name  }
        }
    });

    const vm =app.mount('#root')
```


# computed 计算属性

```JavaScript
    const app = Vue.createApp({
        setup(props,context){
            const { ref, computed } = Vue; // 从 vue 中引用 computed 
            const count =ref(0);
            const handleClick=()=>{
                count.value +=1;
            }

            // 使用 computed
            const conutAdd =computed(()=>{
                return count.value + 5;
            })
            
            return { count, handleClick, conutAdd  }
        }，
        template: ` 
           <div>
                <span @click="handleClick">{{ count }}</span> -- {{ conutAdd }}
           </div>
        `
    });

    const vm =app.mount('#root')
```


# watch 和 watchEffect 的使用和差异性
    watch 侦听器
        1.具备一定的惰性，首次加载时不会执行 （通过增加 第三个 参数：{ immediate: true },使首次加载时执行 ）
        2.需要传递 要侦听的 参数，侦听到值的改变时，会通过回调函数返回， 原始值、当前值


    watchEffect 侦听器 (一般用于 异步)
        1.偏向于 effect ，没有惰性，首次加载时也会立即执行
        2.无需传递你要侦听的内容，会自动感知 代码依赖，对其进行 侦听，只需要传递一个回调函数
        3.不能获取之前数据的值


```JavaScript
    const app =Vue.createApp({
        setup(){
            const {ref,reactive,toRefs,watch,watchEffect} =Vue; // 从 vue 中引用 watch 、watchEffect

            const name =ref('zyj')

            // watch 监听 基础类型
            watch(name,(newVal,oldVal)=>{
                console.log(newVal,oldVal)
            })


            // 监听对象
            const myObj =reactive({age:18},{sex:'man'}) 

            // watch 如果监听对象 中的其中一个 属性 需要写成函数 将值返回
            watch(()=>myObj.age,(newVal,oldVal)=>{
                console.log(newVal,oldVal)
            })


           // watch 监听对象中的 多个 属性,将其作为一个数组传入 进行 监听,返回的参数也 将 是两个数组，第一个数组里的数据 为 新 数据，第二个数组中的数据为 旧数据
            watch([()=>myObj.age , ()=>myObj.sex ],([newAgeVal,newSexVal],[ oldAgeVal,oldSexVal])=>{
                console.log(newAgeVal,oldAgeVal)

                console.log(newSexVal,oldSexVal)
            })


            // watchEffect 自动感到 依赖，进行监听
            watchEffect(()=>{
                console.log(myObj.age)
                console.log(myObj.sex)
            })



            // 使 侦听器 不再进行 侦听 （ watch、watchEffect）
            

            // 将 侦听器 赋给一个 对象，当需要停止时 调用该对象 
            const stop = watchEffect(()=>{
                console.log(myObj.age)
                console.log(myObj.sex)

                setTimeout(()=>{
                    stop(); // 调用该对象 进行停止 侦听
                },5000)

            })



            const {age,sex} = toRefs(myObj)

            return { name,age,sex }
        },
        template:`
            <div>
                <div>
                    Name:<input v-model="name" />
                </div>
                <div>
                    Name is {{name}}
                </div>
            </div>
        `
    })

```



# 生命周期函数的新写法
[Vue 3 生命周期完整指南](https://juejin.cn/post/6945606524987244558)

    beforecate、created => 它们被 setup 方法本身所取代

    beforeMount => onBeforeMount
    mounted => onMounted
    beforeUpdate => onBeforeUpdate
    update => onUpdated
    beforeDestroy => onBeforeUnmount 
    destroyed => onUnmounted 

    errorCaptured => onErrorCaptured


**Vue3 调试钩子 （了解）**

    onRenderTracked  跟踪虚拟 DOM 重新渲染时调用
    onRenderTriggered  虚拟 DOM 重新渲染被触发的时候



# Provide、Inject 模板
    用于父组件向子孙组件传递数据
    provide 在父组件中返回要传给下级的数据，inject 在需要使用这个数据的子辈组件或者孙辈等下级组件中注入数据。


```JavaScript
    const app = Vue.createApp({
        setup(){
            const { ref,provide,readonly } = Vue; 
            const name=ref('zyj')

            // 传递数据，第一个参数 传递的参数名 ， 第二个为传递的 值

            provide('name', readonly(name))  // readonly() 将传递个 子组件的数据处理成为 只读，阻止其修改，确保数据的单向流动

            // 传递 函数 ，接收的组件 可以通过 函数修改 该组件中的数据 
            provide('changeName',(value)=>{ 
                name.value=value
            })

            return {  }
        },
        template: `                         
           <div>                            
                <child />
           </div>
        `
    });

    app.component('child',{
        setup(){
            const { inject } =Vue;
            
            const name =inject('name','默认值'); // 接收参数 ，第一个参数 是要接收的参数名，第二个参数可以设置 默认值

            const changeName=inject('changeName');

            const handleClick=()=>{ // 调用传递过来的 函数进行 修改值
                changeName('lee')
            }

            return {name,handleClick}
        },
        template: ` 
           <div @click="handleClick">
                {{name}}
           </div>
        `
    })

    const vm =app.mount('#root')
```


# ref 的用法
    Composition API 的语法下，获取真实的 DOM 元素节点

```JavaScript
    const app = Vue.createApp({
        setup(){
            const { ref,onMounted } = Vue; 

            const refName=ref(null); // 此 变量名 必须 与需要获取 DOM 中的 ref 值 一致

            OnMounted(()=>{ 
                console.log(refName.value) // 获取 DOM 
            })

            return { refName } // 需要将 接收 DOM 的变量 放出去
        },
        template: `                        
           <div>          
                <div ref="refName">hello ref</div>   // 这里的 ref 是获取 DOM 节点的引用，上面的 ref 是 声明响应式的引用
           </div>
        `
    });

    const vm =app.mount('#root')
```