// 当为函数的形参都给定了 number 时 它返回的参数 不一定为 number如：
function add(first: number, second: number) {
    return first + second + '' // 返回的类型为 string
}


// 可选参数（ ?: ），函数参数可传可不传
function log(sex?: string) {
    return sex;
}


// 联合类型（ | ），如果我们声明了参数类型为 xxx | undefined ，就表示函数参数是不可缺省且类型必须是 xxx 或者 undfined
function log1(x: string | undefined) {
    console.log(x);
}



// 当希望 函数 返回的值为给定的一个类型 可以为函数的返回值声明一个 类型
function add1(first: number, second: number): number {
    return first + second  // 此时返回的类型必须为 number ，否则会报错
}





// 不要返回值 给 函数返回值类型声明为 void ,此时如果有 return 则会报错 
function sayHello(): void {
    console.log("hello")
}




// 函数返回值类型为 never 表示该函数 永远无法将函数内的步骤全部执行完成（函数不能具有可访问的终结点）
function errorEmitter(): never {
    while (true) { }
}





// 当函数的参数为 解构 语法，需要将参数放在后面一个 {} 中进行注解
function yujie({ first, second }: { first: number, second: number }): number {
    return first + second;
}

const total1 = yujie({ first: 1, second: 2 })


// 剩余参数，把多个参数收集到一个变量中

// 1、单一类型
function sum1(...nums: number[]) {
    return nums.reduce((a, b) => a + b, 0);
}
sum1(1, 2); // => 3
sum1(1, 2, 3); // => 6
// sum(1, '2'); // ts(2345) Argument of type 'string' is not assignable to parameter of type 'number'


// 2、复合类型
function sum2(...nums: (number | string)[]): number {
    return nums.reduce<number>((a, b) => a + Number(b), 0);
}
sum2(1, '2', 3); // 6


