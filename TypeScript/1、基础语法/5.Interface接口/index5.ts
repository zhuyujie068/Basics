interface text {
    name: string
}

type text1 = {
    name: string
}

type text2 = string;


/*
    interface 与 type 的区别（能用 interface 就用 interface ，不行时再使用 type）：interface只能表示function，object和class类型，type除了这些类型还可以表示其他类型

    interface创建了一种新的类型，而 type 仅仅是别名，是一种引用；
    如果 type 使用了 union operator （|） 操作符，则不能将 type implements 到 class 上；
    如果 type 使用了 union（|） 操作符 ，则不能被用以 extends interface
    type 不能像 interface 那样合并，其在作用域内唯一
*/



//  interface 接口 就是在 TS 中帮助我们做 语法检验 的工具，并不会编译成 JS




interface Person {
    readonly name: string; // 在属性前面添加 readonly 表示该属性只读
    age?: number; // 在属性后面增加 ？ 表示该属性可有可无
    [propName: string]: any; // 表示 只要属性名为 string 值 可以为 任何类型，的 其他任何 键值对都可以
    sya(): string; //表示传入值必须有一个 sya 方法，该方法必须有一个 string 类型的返回值
}



// interface 接口 还可以使用 extends（衣克丝但丝） 进行继承
interface Teacher extends Person {
    teach(): string
}


const getPersonName = (person: Person): void => {
    console.log(person.name)
}


const setPersonName = (person: Person): void => {

}


const person = {
    name: 'dell',
    sya() {
        return 'say hello'
    }
}

getPersonName(person)
setPersonName(person)


/*
    类型注释 为：
    interface Person {
        readonly name: string;
        age?: number;
    }



    const person = {
        name: 'zyj'，
        sex: 'male'
    }

    getPersonName(person)  当以该形式时 TS 是进行 弱检验，类型注解 中的 属性值 必须要有，但是可以多传递其他属性与值





    当以 字面量 传递对象给变量时 TS 会进行 强检验，对象 中的 属性值 都必须与 类型注解 一样，不能多不能少，否则会报错，解决该方法 可以在 类型注解中 增加 [propName:string]:any 表示 只要属性名为 string 值 可以为 任何类型，的 其他任何 键值对都可以

     getPersonName({
        name: 'zyj',
        sex: 'male'
    })

 */





// class 也可以 应用 interface 接口，应用后就必须拥有 接口 中的存在的 属性
class User1 implements Person {
    name: 'dell';
    sya() {
        return 'say hello'
    }
}




// 定义一个函数的类型声明
interface SayHi {
    (word: string): string // 必须接收一个 word 类型为 string，返回一个 string 
}

const say: SayHi = (word: string) => {
    return word;
}

