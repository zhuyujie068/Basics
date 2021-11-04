// 泛型 generic 泛指的类型

// 泛型 指 的是类型参数化，即将原来某种具体的类型进行参数化

// 设计泛型的 目的 在于有效约束类型成员之间的关系，比如函数参数和返回值、类或者接口成员和方法之间的关系。


// 泛型 在 函数 后面增加 <> 进行声明 , <> 中存放泛型，一般用于 声明 时不确定是什么类型，在使用时进行确定，泛型也可以用于定义返回的 类型
function join<T>(first: T, second: T) {
    return `${first}${second}`;
}

// 将类型确定为 number
join<number>(1, 1); // 可以简写,ts 会进行推断其类型 join(1,1)


// 多个泛型
function joins<T, P>(first: T, second: P) {
    return `${first}${second}`
}
joins<number, string>(1, '2'); // 简写 joins(1,'1')






// 将参数设置为 泛型 并 在后面 增加 [] 表示接受的参数 为 数组,和普通的类型注解一样，这里只不过是类型暂时没有确认而已
function map<T>(params: T[]) {
    return params;
}

// Array<ABC> 与上效果一样
function maps<T>(params: Array<T>) {
    return params;
}

map<string>(['123', '456'])

maps<string>(['123', '456'])