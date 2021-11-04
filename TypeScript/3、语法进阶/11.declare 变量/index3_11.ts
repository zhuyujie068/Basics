// declare 变量

// 声明变量的语法： declare (var|let|const) 变量名称: 变量类型 ，具体示例如下：


// 我们分别使用 var、let、const 声明了 3 种不同类型的变量,使用 var、let 声明的变量是可以更改变量赋值的，而使用 const 声明的变量则不可以。
declare var val1: string;
declare let val2: number;
declare const val3: boolean;
val1 = '1';
val1 = '2';
val2 = 1;


// 声明函数
// 声明函数的语法与声明变量类型的语法相同，不同的是 declare 关键字后需要跟 function 关键字
declare function toString(x: number): string;
const x = toString(1); // => string

// 注意：使用 declare关键字时，我们不需要编写声明的变量、函数、类的具体实现（因为变量、函数、类在其他库中已经实现了），只需要声明其类型即可，



// 声明类 
// 声明类时，我们只需要声明类的属性、方法的类型即可。 

declare class Person {
    public name: string;
    private age: number;
    constructor(name: string);
    getAge(): number;
}
const person = new Person('Mike');
person.name; // => string
person.getAge(); // => number



// 声明枚举
// 声明枚举只需要定义枚举的类型，并不需要定义枚举的值
declare enum Direction {
    Up,
    Down,
    Left,
    Right,
}
const directions = [Direction.Up, Direction.Down, Direction.Left, Direction.Right];

// 注意：声明枚举仅用于编译时的检查，编译完成后，声明文件中的内容在编译结果中会被删除



// declare 模块
// 声明模块的语法: declare module '模块名' { }。
// lodash.d.ts

/*

    // lodash.d.ts
    declare module 'lodash' {
        export function first<T extends unknown>(array: T[]): T;
    }

    // index.ts
    import { first } from 'lodash';
    first([1, 2, 3]); // => number;

*/

