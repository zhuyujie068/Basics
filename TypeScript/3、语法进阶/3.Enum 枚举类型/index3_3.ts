enum Status {
    OFFLINE,
    ONLINE = 5,
    DELETED
};

// enum 枚举 数据类型可以反向推断获取，默认下标从 0 开始递增
console.log(Status.ONLINE) // 5
console.log(Status[6]) // DELETED


// 应用场景
function getResult(status) {
    if (status === Status.OFFLINE) {
        return 'offline';
    } else if (status === Status.ONLINE) {
        return 'online'
    } else if (status === Status.DELETED) {
        return 'deleted'
    }
    return 'error'
}

console.log(getResult(0)); // offline



/*
    外部枚举
        在 TypeScript 中，我们可以通过 declare 描述一个在其他地方已经定义过的变量。
        外部枚举的作用在于为两个不同枚举（实际上是指向了同一个枚举类型）的成员进行兼容、比较、被复用提供了一种途径，这在一定程度上提升了枚举的可用性，让其显得不那么“鸡肋”。

        declare let $: any;
        $('#id').addClass('show'); // ok



    外部枚举 和 常规枚举的差异在于以下几点：
        在外部枚举中，如果没有指定初始值的成员都被当作计算（值）成员，这跟常规枚举恰好相反；
        即便外部枚举只包含字面量成员，这些成员的类型也不会是字面量成员类型，自然完全不具备字面量类型的各种特性。
*/

