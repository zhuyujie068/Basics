/*
访问类型
    private                      私有        允许在类内被使用
    protected （泼但的特的）      受保护的    允许在类内及继承的子类中使用
    public（默认）                公开        允许在类内外被调用
*/

/*
    只读修饰符
        public 修饰的属性既公开可见，又可以更改值，如果我们不希望类的属性被更改，则可以使用 readonly 只读修饰符声明类的属性

        class Son {
            public readonly firstName: string;
            constructor(firstName: string) {
                this.firstName = firstName;
            }
        }   

        const son = new Son('Tony');
 */



// constructor 构造器 当类被 实例 时会自动执行

class Person7 {
    // 在构造函数的参数上使用 public 等同于创建了同名的成员变量。
    constructor(public name: string) { }
}

class Teacher7 extends Person7 {
    // 当 子类 继承 父类，子类 还想声明一个 构造器，则需要在子类中的构造器中 调用 父类 ,如果 父类中有 构造器 则要传递相应的 参数（派生类的构造函数必须包含 "super" 调用）
    constructor(public age: number) {
        // super() 调用父类
        super("zyj");
    }
}


const teacher7 = new Teacher7(28);
console.log(teacher7.age)
console.log(teacher7.name)
