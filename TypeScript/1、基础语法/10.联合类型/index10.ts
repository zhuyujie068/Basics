/*
    联合类型
        联合类型（Unions）用来表示变量、参数的类型不是单一原子类型，而可能是多种不同的类型的组合。主要通过“|”操作符分隔类型的语法来表示联合类型。



    交叉类型
        交叉类型（Intersection Type），它可以把多个类型合并成一个类型，合并后的类型将拥有所有成员类型的特性。可以使用“&”操作符来声明交叉类型。一般用于 合并接口类型、合并联合类型

        合并接口类型（就是将多个接口类型合并成一个类型，从而实现等同接口继承的效果）

            type IntersectionType = { id: number; name: string; } & { age: number };

            const mixed: IntersectionType = {
                id: 1,
                name: 'name',
                age: 18
            }



        合并联合类型 （需要同时满足不同的联合类型限制，也就是提取了所有联合类型的相同类型成员，如果多个联合类型中没有相同的类型成员，交叉出来的类型自然就是 never ）

            type UnionA = 'px' | 'em' | 'rem' | '%';
            type UnionB = 'vh' | 'em' | 'rem' | 'pt';
            type IntersectionUnion = UnionA & UnionB;
            const intersectionA: IntersectionUnion = 'em'; // ok
            const intersectionB: IntersectionUnion = 'rem'; // ok
            const intersectionC: IntersectionUnion = 'px'; // ts(2322)
            const intersectionD: IntersectionUnion = 'pt'; // ts(2322)



    注：联合操作符 | 的优先级低于交叉操作符 &，同样，我们可以通过使用小括弧 () 来调整操作符的优先级。



    类型缩减
        如果将 string 原始类型和“string字面量类型”组合成联合类型会是什么效果？
        效果就是类型缩减成 string 了。

        type BorderColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | string; // 类型缩减成 string


        阻止 类型缩减
            只需要给父类型添加“& {}”即可

          type BorderColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | string & {}; // 字面类型都被保留




*/


