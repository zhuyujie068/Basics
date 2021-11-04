/**
    TS 相比 JS 优势
    1、开发过程中，能发现潜在问题
    2、更友好的编辑器自动提示
    3、代码语义更清晰易懂
 

    安装 ts
    npm install -g typescript


    tsc xxx.ts 将 xxx.ts 文件转换成 xxx.js 文件，以方便 浏览器、node 运行，不会使用 tsconfig.json 配置项
    tsc 将会把项目下面的 所有 ts 文件转换成为 js 文件，默认 使用 tsconfig.json 配置项


    tsc -W 将会持续监听 文件下面 ts 文件的变化并将其进行编译成为 js

    tsconfig.json 中 的 outDir 值 表示为 ts 编译成为 js 放在哪个目录下面， "outDir": "./build"   编译后放在 build 文件下面


    将 ts 转换成为 js 并且使用 node 进行运行
    npm install -g ts-node
     ts-node xxx.ts = 相当于 => tsc xxx.ts (文件) 再使用node运行 生成的 xxx.js 文件


    nodemon 是一种工具，可以自动检测到目录中的文件更改时通过重新启动应用程序来调试基于node.js的应用程序。
    nodemon xxx xxx xxx.js   当 xxx.js 文件变化后 就执行 xxx xxx xxx.js 命令， nodemon node ./build/index.js 表示 index.js 文件更改后 就执行 node ./build/index.js 命令


    npm init            生成    package.json
    tsc --init          生成    tsconfig.json
 * /



/* 自定义类型 interface */

/*
    基础类型
        布尔值                          boolean
        数字                            number
        字符串                          string
        表示没有任何类型                 void
        null                            null
        undefined                       undefined
        symbol                          symbol
*/

/*
    特殊类型
        1. any  （安林）   
            any 指的是一个任意类型，它是官方提供的一个选择性绕过静态类型检测的作弊方式。(any 类型可以赋值给除了 never 之外的任意其他类型，反过来其他类型也可以赋值给 any。)
                我们可以对被注解为 any 类型的变量进行任何操作，包括获取事实上并不存在的属性、方法，并且 TypeScript 还无法检测其属性是否存在、类型是否正确。

            注：any is 魔鬼，我们一定要慎用、少用。


        2. unknown（昂 No ）
            unknown 是 TypeScript 3.0 中添加的一个类型，它主要用来描述类型并不确定的变量。
                与 any 不同的是，unknown 在类型上更安全。不能把 unknown 赋值给除了 any 之外任何其他类型，反过来其他类型都可以赋值给 unknown。
    
            
        3. never
            never 表示永远不会发生值的类型。函数因为永远不会有返回值（如果函数代码中是一个死循环），所以它的返回值类型就是 never。
                never 是所有类型的子类型，它可以给所有类型赋值，但是反过来，除了 never 自身以外，其他类型（包括 any 在内的类型）都不能为 never 类型赋值。

        
        4. void
            void 仅适用于表示没有返回值的函数。即如果该函数没有返回值，那它的类型就是 void。
                void 类型仅可以赋值给 any 和 unknown 类型，反过来仅 any、never、undefined 可以赋值给 void。
                
*/





//  当变量声明与赋值在一行时（声明时并没有进行类型注解） TS 可以直接推断出 类型，如果不在一行时，TS 无法进行推断
let count1: number; // 给变量进行 类型注解

let count2 = 123; // TS 推断类型为 number


let count3;
count3 = 123; // TS 无法进行 类型推断



// 对一个变量注解为两种类型
let temp: number | string = 123; //此时 temp 值及可以为 number 或 string
temp = '456';





/*
    对象类型
        数组                            []
        类                              class
        函数                            function
        普通对象                        {}
*/


// 函数类型声明 两种 方法：


// 方法一：TS 根据 return 时 发现 parseInt() 方法推断出 返回值 一定为 number ，所以此时 返回值 不需要进行类型注解（使用此方法一般情况下都不需要进行返回值类型注解，因为TS可以推断出来）

// const func = (str: string): number => {
//     return parseInt(str, 10)
// }

const func2 = (str: string) => {
    return parseInt(str, 10)
}




// 方法二：但是此方法必须对返回值进行注解，否则语法报错
const func3: (str: string) => number = (str) => {
    return parseInt(str, 10)
}



// 像通过 new Date() 声明的变量 ，TS 可以推断其类型
const date = new Date()




