/*
    type annotation 类型注解，我们来告诉 TS 变量是什么类型
    type inference 类型推断，TS 会自动的去尝试分析变量的类型
    如果 TS 能够自动分析变量类型，我们就什么也不需要做了
    如果 TS 无法分析变量类型的话，我们就需要使用类型注解 （一般函数的参数需要给定 类型注解）
*/

/*
    类型推断
        在 TypeScript 中，类型标注声明是在变量之后（即类型后置），它不像 Java 语言一样，先声明变量的类型，再声明变量的名称。
        使用类型标注后置的好处是编译器可以通过代码所在的上下文推导其对应的类型，无须再声明变量类型。

        {
            let x1 = 42; // 推断出 x1 的类型是 number
            let x2: number = x1; // ok
        }

*/



// 类型注解
let count: number;
count = 123;


// 当没有为什么的变量进行 类型注解 TS 会进行类型推断
{
    const firstNumber = 1;
    const secondNumber = 2;
    const total = firstNumber + secondNumber;
}




// 此时 TS 无法推断出 函数 需要传递的变量的类型，因为传递的参数可以是 number 也可以是 string 
function getTotal(firstNumber, secondNumber) { // 此时需要我们给参数给定 类型注解 firstNumber:number , secondNumber:number ,从而 return 后 TS 可以推断 total 的数据类型为 number  
    return firstNumber + secondNumber;
}

const total = getTotal(1, 2);



// TS 自动推断 Obj 的属性类型 , name 为 string ，age 为 number
const obj = {
    name: 'dell',
    age: 18
}


/*
    字面量类型
        在 TypeScript 中，字面量不仅可以表示值，还可以表示类型，即所谓的字面量类型。
        目前，TypeScript 支持 3 种字面量类型：字符串字面量类型、数字字面量类型、布尔字面量类型，对应的字符串字面量、数字字面量、布尔字面量分别拥有与其值一样的字面量类型，具体示例如下：

        {
            let specifiedStr: 'this is string' = 'this is string';
            let specifiedNum: 1 = 1;
            let specifiedBoolean: true = true;
        }

*/


/*
    let 声明的简单类型字面量会拓宽类型，
    const 声明的简单类型字面量会收窄，
    const 声明的对象变量会自动推断对应的类型，可以用 as const 收窄（会让对象的每个属性变成只读），让每一个key都是固定类型
*/


/*
    类型守卫
        类型守卫可以理解为就是条件判断，只不过在 TypeScript 类型层面，条件判断顺带的会触发类型缩小。

        {
            let func = (anything: any) => {
                if (typeof anything === 'string') {
                return anything; // 类型是 string
                } else if (typeof anything === 'number') {
                return anything; // 类型是 number
                }
                return null;
            };
        }
*/