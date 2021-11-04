// ****** 数组（数组的注解可以数 基础类型 也可以是 对象类型） *******


// 数组中数据类型为某一种
const stringArr: string[] = ['a', 'b', 'c'] // 该数组中数据类型只能为 string
const undefinedArr: undefined[] = [undefined] // 该数组中数据类型只能为 undefined


// 表示数组中可以有 number、string 两种数据类型 
const arr: (number | string)[] = [1, '2', 3];


//  数组中包含对象（对象数组类型），对象中必须有，只能有 name、age 两个属性
const objectArr: { name: string, age: number }[] = [{
    name: 'zyj',
    age: 25
}]


// type alias 类型别名
type User = { name: string, age: number };

const objectArr1: User[] = [{
    name: 'zyj',
    age: 25
}]


// 使用 class 给类型
class Teacher1 {
    name: string;
    age: number;
}

const objectArr2: Teacher1[] = [
    new Teacher1(),

    {
        name: 'zyj',
        age: 28
    }
]


// 可以 省略 new Teacher() 解写
const objectArr3: Teacher1[] = [
    {
        name: 'zyj',
        age: 28
    }
];








// ****** 元组（tuple）可以更好约束数组中的数据 *******
// 元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同

const teacherInfo: [string, boolean, number] = ['zyj', true, 18] // 数组内数据类型必须是按照注解类型顺序，其数据数量也应该与注解的数量一致

// 可以在处理 csv 文件时使用
const teacherList: [string, string, number][] = [
    ['dell', 'male', 19],
    ['sun', 'female', 26],
    ['jeny', 'male', 38]
]

// 注： ts 的元组无法在运行时约束所谓的 “元组” 像真正的元组一样保证元素类型、长度不可变更
