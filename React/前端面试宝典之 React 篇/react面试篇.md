## 谈一谈你对 React 的理解？

    回答问题思路：“讲概念，说用途，理思路，优缺点，来一遍”，还需要对你长期开发过程中的思考，有经验层面的方法总结。

![回答思路.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7fe25e3a2fd1400bb29c197aaa3b361f~tplv-k3u1fbpfcp-watermark.image?)

### react 优缺点

#### 优点

    1、声明式 (jsx)
        声明式编程的优势在于直观，可以做到一目了然，也便于组合。

    2、组件式
        组件化可以降低系统间功能的耦合性，提高功能内部的聚合性。

    3、调用性
        React 将 DOM 抽象为虚拟 DOM，开发者并不会直接操作 DOM。
        无论是 Native、VR 还是 Shell 命令，只要兼容虚拟 DOM 层，那么都可以直接运行 React。

#### 缺点

    由于 React 并不是一个一揽子框架，比如路由一类的功能，React 团队更希望交给社区来解决。所以导致在技术选型与学习使用上有比较高的成本。

### 用途

    React 的用途当然是构建视图啦。由于 React 虚拟 DOM 的关系，在适用场景上远比传统框架更为广泛：
    1. 首先无论是 PC 网页还是移动端网页，都是完全支持的；
    2. 其次由于 React Native，也可以用于开发 iOS 与 Android 应用；
    3. 还有 React 360 可以开发 VR 应用；
    4. 冷门儿的如 ink，也可以使用 React 开发命令行应用。

### 据上总结回答

1. 它的核心设计思路有三点，分别是声明式、组件化与 通用性。
2. 声明式的优势在于直观与组合。
3. 组件化的优势在于视图的拆分与模块复用，可以更容易做到高内聚低耦合。
4. 通用性在于一次学习，随处编写。比如 React Native，React 360 等， 这里主要靠虚拟 DOM 来保证实现。
5. 这使得 React 的适用范围变得足够广，无论是 Web、Native、VR，甚至 Shell 应用都可以进行开发。这也是 React 的优势。
6. 但作为一个视图层的框架，React 的劣势也十分明显。它并没有提供完整的一揽子解决方 案，在开发大型前端应用时，需要向社区寻找并整合解决方案。虽然一定程度上促进了社区的繁荣，但也为开发者在技术选型和学习适用上造成了一定的成本。

## 为什么 React 要用 JSX？

![为什么 React 使用 JSX.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e29b568e65af4505b8c2b97927d3579a~tplv-k3u1fbpfcp-watermark.image?)

    1. JSX 是一个 JavaScript 的语法扩展，结构类似 XML。即使使用了 JSX，也会在构建过程中，通过 Babel 插件编译为 React.createElement。所以 JSX 更像是 React.createElement 的一种语法糖。

    2. React 团队认为模板不应该是开发过程中的关注点，因为引入了模板语法、模板指令等概念，是一种不佳的实现方案。

    3. 模板字符串编写的结构会造成多次内部嵌套，使整个结构变得复杂，并且优化代码提示也会变得困难重重。

    4. JXON，同样因为代码提示困难的原因而被放弃。

## Babel 插件如何实现 JSX 到 JS 的编译？（进阶）

    Babel 读取代码并解析，生成 AST，再将 AST 传入插件层进行转换，在转换时就可以将 JSX 的结构转换为 React.createElement 的函数。

    如下代码所示(了解)：

```js
module.exports = function (babel) {
  var t = babel.types;
  return {
    name: "custom-jsx-plugin",
    visitor: {
      JSXElement(path) {
        var openingElement = path.node.openingElement;
        var tagName = openingElement.name.name;
        var args = [];
        args.push(t.stringLiteral(tagName));
        var attribs = t.nullLiteral();
        args.push(attribs);
        var reactIdentifier = t.identifier("React"); //object
        var createElementIdentifier = t.identifier("createElement");
        var callee = t.memberExpression(reactIdentifier, createElementIdentifier);
        var callExpression = t.callExpression(callee, args);
        callExpression.arguments = callExpression.arguments.concat(path.node.children);
        path.replaceWith(callExpression, path.node);
      },
    },
  };
};
```

## 如何避免生命周期中的坑？

### 挂载阶段

    挂载阶段是指组件从初始化到完成加载的过程。

#### constructor (已被去除)

    constructor 是类通用的构造函数，常用于初始化。所以在过去，constructor 通常用于初始化 state 与绑定函数。


    社区中去除 constructor 的原因非常明确：

    1. constructor 中并不推荐去处理初始化以外的逻辑；
    2. 本身 constructor 并不属于 React 的生命周期，它只是 Class 的初始化函数；
    3. 通过移除 constructor，代码也会变得更为简洁。

#### getDerivedStateFromProps

    本函数的作用是使组件在 props 变化时更新 state，它的触发时机是：
    1. 当 props 被传入时；
    2. state 发生变化时；
    3. forceUpdate 被调用时。


    它的使用场景是很有限的，不推荐写法（这两种写法除了增加代码的维护成本外，没有带来任何好处）：
    1. 直接复制 prop 到 state；
    2. 在 props 变化后修改 state。

#### UNSAFE_componentWillMount（已被弃用）

    也就是 componentWillMount，本来用于组件即将加载前做某些操作，但目前被标记为弃用。因为在 React 的异步渲染机制下，该方法可能会被多次调用。

#### render

    render 函数返回的 JSX 结构，用于描述具体的渲染内容。但切记，render 函数并没有真正的去渲染组件，渲染是依靠 React 操作 JSX 描述结构来完成的。还有一点需要注意，render 函数应该是一个纯函数，不应该在里面产生副作用，比如调用 setState 或者绑定事件。


    那为什么不能 setState 呢？
        因为 render 函数在每次渲染时都会被调用，而 setState 会触发渲染，就会造成死循环。


    那又为什么不能绑定事件呢？
        因为容易被频繁调用注册。

#### componentDidMount

    componentDidMount 主要用于组件加载完成时做某些操作，比如发起网络请求或者绑定事件，该函数是接着 render 之后调用的。但 componentDidMount 一定是在真实 DOM 绘制完成之后调用吗？在浏览器端，我们可以这么认为。

    但在其他场景下，尤其是 React Native 场景下，componentDidMount 并不意味着真实的界面已绘制完毕。由于机器的性能所限，视图可能还在绘制中。

### 更新阶段

    更新阶段是指外部 props 传入，或者 state 发生变化时的阶段。

#### UNSAFE_componentWillReceiveProps (已被弃用)

    因为其功能可被函数 getDerivedStateFromProps 所替代。

#### getDerivedStateFromProps

    同挂载阶段的表现一致。

#### shouldComponentUpdate

    该方法通过返回 true 或者 false 来确定是否需要触发新的渲染。因为渲染触发最后一道关卡，所以也是性能优化的必争之地。通过添加判断条件来阻止不必要的渲染。

    React 官方提供了一个通用的优化方案，也就是 PureComponent。PureComponent 的核心原理就是默认实现了shouldComponentUpdate函数，在这个函数中对 props 和 state 进行浅比较，用来判断是否触发更新。

#### UNSAFE_componentWillUpdate (已被弃用)

    因为后续的 React 异步渲染设计中，可能会出现组件暂停更新渲染的情况。

#### render

    同挂载阶段一致。

#### getSnapshotBeforeUpdate

    getSnapshotBeforeUpdate 方法是配合 React 新的异步渲染的机制，在 DOM 更新发生前被调用，返回值将作为 componentDidUpdate 的第三个参数。

#### componentDidUpdate

    getSnapshotBeforeUpdate 的返回值会作为componentDidUpdate的第三个参数使用。

### 卸载阶段

    卸载阶段就容易很多了，只有一个回调函数。

#### componentWillUnmount

    该函数主要用于执行清理工作。一个比较常见的 Bug 就是忘记在 componentWillUnmount 中取消定时器，导致定时操作依然在组件销毁后不停地执行。所以一定要在该阶段解除事件绑定，取消定时器。

![react生命周期.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c792f6d86ae487d967168b235318767~tplv-k3u1fbpfcp-watermark.image?)

### 什么情况下会触发重新渲染。

#### 函数组件

    函数组件任何情况下都会重新渲染。它并没有生命周期，但官方提供了一种方式优化手段，那就是 React.memo。

```js
const MyComponent = React.memo(function MyComponent(props) {
  /* 使用 props 渲染 */
});
```

##### React.memo

    React.memo 并不是阻断渲染，而是跳过渲染组件的操作并直接复用最近一次渲染的结果，这与 shouldComponentUpdate 是完全不同的。

##### React.Component

    如果不实现 shouldComponentUpdate 函数，那么有两种情况触发重新渲染。

    当 state 发生变化时。这个很好理解，是常见的情况。

    当父级组件的 Props 传入时。无论 Props 有没有变化，只要传入就会引发重新渲染。

##### React.PureComponent

    PureComponent 默认实现了 shouldComponentUpdate 函数。所以仅在 props 与 state 进行浅比较后，确认有变更时才会触发重新渲染。

### 渲染中发生报错后会怎样？又该如何处理？

    错误边界是一种 React 组件，这种组件可以捕获并打印发生在其子组件树任何位置的 JavaScript 错误，并且，它会渲染出备用 UI，如下 React 官方所给的示例：

```js
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

**但渲染时的报错，只能通过 componentDidCatch 捕获。** 这是在做线上页面报错监控时，极其容易忽略的点儿。

## React 的请求应该放在哪里，为什么?

    对于异步请求，应该放在 componentDidMount 中去操作。从时间顺序来看，除了 componentDidMount 还可以有以下选择：

    constructor：可以放，但从设计上而言不推荐。constructor 主要用于初始化 state 与函数绑定，并不承载业务逻辑。而且随着类属性的流行，constructor 已经很少使用了。

    componentWillMount：已被标记废弃，在新的异步渲染架构下会触发多次渲染，容易引发 Bug，不利于未来 React 升级后的代码维护。

    所以React 的请求放在 componentDidMount 里是最好的选择。

## 类组件与函数组件有什么区别呢？

    作为组件而言，类组件与函数组件在使用与呈现上没有任何不同，性能上在现代浏览器中也不会有明显差异。类组件是基于面向对象编程的，它主打的是继承、生命周期等核心概念；而函数组件内核是函数式编程，主打的是 immutable、没有副作用、引用透明等特点。由于 React Hooks 的推出，生命周期概念的淡出，函数组件可以完全取代类组件。其次继承并不是组件最佳的设计模式，官方更推崇“组合优于继承”的设计概念，所以类组件在这方面的优势也在淡出。性能优化上，类组件主要依靠 shouldComponentUpdate 阻断渲染来提升性能，而函数组件依靠 React.memo 缓存渲染结果来提升性能。

![类组件与函数组件有什么区别呢？.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df836d8fa0cf4458a2c986b0951d39b6~tplv-k3u1fbpfcp-watermark.image?)

    类组件的根基是 OOP（面向对象编程），所以它有继承、有属性、有内部状态的管理。
    函数组件的根基是 FP，也就是函数式编程。

## 如何设计 React 组件？

![React组件设计.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b349abe9a767401485d1f2faeb202d85~tplv-k3u1fbpfcp-watermark.image?)

### React 社区中非常经典的分类模式：

1. 把只作展示、独立运行、不额外增加功能的组件，称为**哑组件**，或**无状态组件**，还有一种叫法是**展示组件**。
2. 把处理业务逻辑与数据状态的组件称为**有状态组件**，或**灵巧组件**，灵巧组件一定包含至少一个灵巧组件或者展示组件。

**注：展示组件的复用性更强，灵巧组件则更专注于业务本身**

### 展示组件

    展示组件具有极强的通用性，复用率也很高，往往与当前的前端工程关系相对薄弱，甚至可以做到跨项目级的复用。

#### 代理组件

    代理组件常用于封装常用属性，减少重复代码。

```js
import { Button as AntdButton } from from 'antd'
const Button = props => <AntdButton size="small" type="primary" {...props}>
export default Button
```

#### 样式组件

    样式组件也是一种代理组件，只是又细分了处理样式领域，将当前的关注点分离到当前组件内。

```js
import classnames from "classnames";

const StyleButton = ({ className, primary, isHighLighted,  ...props }) => (
  <Button
    type="button"
    className={classnames("btn", {
     btn-primary: primary,
     highLight: isHighLighted,
}, className)}
    {...props}
  />
);
```

#### 布局组件

    布局本身是确定的，不需要根据外部状态的变化去修改内部组件。所以这也是一个可以减少渲染的优化点。

```js
<Layout Top={<NavigationBar />} Content={<Article />} Bottom={<BottomBar />} />
```

### 灵巧组件

由于灵巧组件面向业务，所以相对于展示组件来说，其功能更为丰富、复杂性更高，而复用度更低。**展示组件专注于组件本身特性，灵巧组件更专注于组合组件。**

#### 高阶组件

    高阶组件可以组合完成链式调用，如果基于装饰器使用，就更为方便了。高阶组件中还有一个经典用法就是反向劫持，通过重写渲染函数的方式实现某些功能，比如场景的页面加载圈等。但高阶组件也有两个缺陷，第一个是静态方法不能被外部直接调用，需要通过向上层组件复制的方式调用，社区有提供解决方案，使用 hoist-non-react-statics 可以解决；第二个是 refs 不能透传，使用 React.forwardRef API 可以解决。

## setState 是同步更新还是异步更新？

### 合成事件

    在没有合成事件前，大家是如何处理事件的呢？

最恰当的处理方式是采用**事件委托**。通过将事件绑定在 ul 标签上这样的方式来解决。当 li 标签被点击时，由事件冒泡到父级的 ul 标签去触发，并在 ul 标签的 onclick 事件中，确认是哪一个 li 标签触发的点击事件。(如下代码)

```js
<ul id="test">
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <li>4</li>
  <li>5</li>
  <li>10000</li>
</ul>
<script>
  function getEventTarget(e) {
      e = e || window.event;
      return e.target || e.srcElement;
  }
  var ul = document.getElementById('test');
  ul.onclick = function(event) {
      var target = getEventTarget(event);
      alert(target.innerHTML);
  };
</script>
```

同样，出于性能考虑，合成事件也是如此：

1. React 给 DOM 容器挂上事件监听；
2. 找到对应的组件，造出一个合成事件出来；
3. 并按组件树模拟一遍事件冒泡。

![合成事件.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/840ff4c096894782a537640ced882f8a~tplv-k3u1fbpfcp-watermark.image?)

### 异步场景

```js
class Test extends Component {
    state = {
        count: 0
    }

    componentDidMount(){
        this.setState({
           count: 1
         }, () => {
            console.log(this.state.count) //1
         })
        console.log(this.state.count) // 0
    }

    render(){
        ...
    }
}
```

由于我们接受 setState 是异步的，所以会认为回调函数是异步回调，打出 0 的 console.log 会先执行，打出 1 的会后执行。

### 为什么 setState 是异步的

1. **保持内部一致性。** 如果改为同步更新的方式，尽管 setState 变成了同步，但是 props 不是。
2. **为后续的架构升级启用并发更新。** 为了完成异步渲染，React 会在 setState 时，根据它们的数据来源分配不同的优先级，这些数据来源有：事件回调句柄、动画效果等，再根据优先级并发处理，提升渲染性能。

### 同步场景

```js
class Test extends Component {
    state = {
        count: 0
    }

    componentDidMount(){
        this.setState({ count: this.state.count + 1 });
        console.log(this.state.count);
        setTimeout(() => {
          this.setState({ count: this.state.count + 1 });
          console.log("setTimeout: " + this.state.count);
        }, 0);
    }

    render(){
        ...
    }
}
```

正确的结果是 0,2。因为 **setState 并不是真正的异步函数，它实际上是通过队列延迟执行操作实现的，通过 isBatchingUpdates 来判断 setState 是先存进 state 队列还是直接更新。值为 true 则执行异步操作，false 则直接同步更新。** 所以在 addEventListener 、setTimeout、setInterval 这些原生事件中都会同步更新。

### 据上总结回答

![setState 是同步更新还是异步更新.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8bfe9858500b48f985d34d7c33c084eb~tplv-k3u1fbpfcp-watermark.image?)

    setState 并非真异步，只是看上去像异步。在源码中，通过 isBatchingUpdates 来判断。

    setState 是先存进 state 队列还是直接更新，如果值为 true 则执行异步操作，为 false 则直接更新。

    那么什么情况下 isBatchingUpdates 会为 true 呢？在 React 可以控制的地方，就为 true，比如在 React 生命周期事件和合成事件中，都会走合并操作，延迟更新的策略。

    但在 React 无法控制的地方，比如原生事件，具体就是在 addEventListener 、setTimeout、setInterval 等事件中，就只能同步更新。

    一般认为，做异步设计是为了性能优化、减少渲染次数，React 团队还补充了两点。

    保持内部一致性。如果将 state 改为同步更新，那尽管 state 的更新是同步的，但是 props不是。

    启用并发更新，完成异步渲染。

### 进阶 这是一道经常会出现的 React setState 笔试题：下面的代码输出什么呢？

```js
class Test extends React.Component {
  state = {
    count: 0,
  };

  componentDidMount() {
    this.setState({ count: this.state.count + 1 });
    console.log(this.state.count);

    this.setState({ count: this.state.count + 1 });
    console.log(this.state.count);

    setTimeout(() => {
      this.setState({ count: this.state.count + 1 });
      console.log(this.state.count);

      this.setState({ count: this.state.count + 1 });
      console.log(this.state.count);
    }, 0);
  }

  render() {
    return null;
  }
}
```

    我们可以进行如下的分析：

    首先第一次和第二次的 console.log，都在 React 的生命周期事件中，所以是异步的处理方式，则输出都为 0；

    而在 setTimeout 中的 console.log 处于原生事件中，所以会同步的处理再输出结果，但需要注意，虽然 count 在前面经过了两次的 this.state.count + 1，但是每次获取的 this.state.count 都是初始化时的值，也就是 0；

    所以此时 count 是 1，那么后续在 setTimeout 中的输出则是 2 和 3。

    所以完整答案是 0,0,2,3。

**注： concurrent 模式下，很多就有的认知都会被打碎重塑，但目前 concurrent 还处于 unstable 的状态，上面中探讨的还是同步模式下的结果。**

## 如何面向组件跨层级通信？

![如何面向组件跨层级通信？.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28184c617e80423e907b04facb22a693~tplv-k3u1fbpfcp-watermark.image?)

1. 父与子的情况下，因为 React 的设计实际上就是传递 Props 即可。
2. 子与父的情况下，有两种方式，分别是 **回调函数** 与 **实例函数** 。

   a. 回调函数，比如输入框向父级组件返回输入内容，按钮向父级组件传递点击事件等。
   b. 实例函数的情况有些特别，主要是在父组件中通过 React 的 ref API 获取子组件的实例，然后是通过实例调用子组件的实例函数。

3. 多层级间的数据通信，有两种情况。第一种是一个容器中包含了多层子组件，需要最底部的子组件与顶部组件进行通信。在这种情况下，如果不断透传 Props 或回调函数，不仅代码层级太深，后续也很不好维护。第二种是两个组件不相关，在整个 React 的组件树的两侧，完全不相交。那么基于多层级间的通信一般有三个方案。

   a. 使用 React 的 Context API，最常见的用途是做语言包国际化。

   b. 使用全局变量与事件。全局变量通过在 Windows 上挂载新对象的方式实现，这种方式一般用于临时存储值，这种值用于计算或者上报，缺点是渲染显示时容易引发错误。

   c. 使用状态管理框架，比如 Flux、Redux 及 Mobx。优点是由于引入了状态管理，使得项目的开发模式与代码结构得以约束，缺点是学习成本相对较高。

## 列举一种你了解的 React 状态管理框架？

![列举一种你了解的 React 状态管理框架？.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1dcd66483e4a4c70af632a2dc313d7b1~tplv-k3u1fbpfcp-watermark.image?)

### Redux

#### Redux 的 “三原则”？

1. **单一数据源** ，即整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 Store 中。
2. **纯函数 Reducer** ，即为了描述 Action 如何改变状态树 ，编写的一个纯函数的 Reducer。
3. **state 是只读的** ，唯一可以改变 state 的方法就是触发 Action，Action 是一个用于描述已发生事件的普通对象。

注：这三大原则使 Redux 的调试工具实现了时间回溯功能，通过录制回放 Action，完整重现了整个应用路径，这在当时引发了不小的轰动。

### Redux 的优点

1. 结果可预测；
2. 代码结构严格易维护；
3. 模块分离清晰且小函数结构容易编写单元测试；
4. Action 触发的方式，可以在调试器中使用时间回溯，定位问题更简单快捷；
5. 单一数据源使服务端同构变得更为容易；
6. 社区方案多，生态也更为繁荣。

### Redux 的 “副作用（缺点）”？

**AJAX 请求等异步工作，或不是纯函数产生的第三方的交互都被认为是 “副作用”。** 一个常见的副作用的例子是这样的，你发一个网络请求，需要界面先显示 Loading，再根据请求是否成功，来决定显示数据还是显示报错信息，你会发现在整个过程中，异步操作在 Redux 中无从添加，因为 Redux 本身深受函数式编程的影响，导致：

1. 所有的事件都收拢 Action 去触发；
2. 所有的 UI 状态都交给 Store 去管理；
3. 所有的业务逻辑都交由 Reducer 去处理。

在这里 Action、Reducer 是纯函数，Store 也只是一个 state 状态树，都不能完成处理副作用的操作。

#### 社区通常有两种解决方案：

1. 在 Dispatch 的时候会有一个 middleware 中间件层，拦截分发的 Action 并添加额外的复杂行为，还可以添加副作用。第一类方案的流行框架有 Redux-thunk、Redux-Promise、Redux-Observable、Redux-Saga 等。

2. 允许 Reducer 层中直接处理副作用，采取该方案的有 React Loop，React Loop 在实现中采用了 Elm 中分形的思想，使代码具备更强的组合能力。

## 虚拟 DOM 的工作原理是什么？

![虚拟 DOM 的工作原理.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd96d5f28e8b4da8a2f439a4a9fe2f30~tplv-k3u1fbpfcp-watermark.image?)

```js
// React 有两个函数：
// diff 函数，去计算状态变更前后的虚拟 DOM 树差异；
import React from "react";

// 渲染函数，渲染整个虚拟 DOM 树或者处理差异点。
import ReactDOM from "react-dom";
```

### 工作原理

通过 JS 对象模拟 DOM 的节点。

### 实现上

**常是 Plain Object** ，以 React 为例，在 render 函数中写的 JSX 会在 Babel 插件的作用下，编译为 React.createElement 执行 JSX 中的属性参数。

React.createElement 执行后会返回一个 Plain Object，它会描述自己的 tag 类型、props 属性以及 children 情况等。这些 Plain Object 通过树形结构组成一棵虚拟 DOM 树。当状态发生变更时，将变更前后的虚拟 DOM 树进行差异比较，这个过程称为 diff，生成的结果称为 patch。计算之后，会渲染 Patch 完成对真实 DOM 的操作。

### 优点

1. 改善大规模 DOM 操作的性能。（首次渲染或微量操作，虚拟 DOM 的渲染速度就会比真实 DOM 更慢。）
2. 规避 XSS 风险。（虚拟 DOM 内部确保了字符转义，所以确实可以做到这点，但 React 存在风险，因为 React 留有 dangerouslySetInnerHTML API 绕过转义。）
3. 能以较低的成本实现跨平台开发。

### 缺点

1. 内存占用较高。（因为当前网页的虚拟 DOM 包含了真实 DOM 的完整信息，而且由于是 Object，其内存占用肯定会有所上升。）
2. 无法进行极致优化。（虽然虚拟 DOM 足以应对绝大部分应用的性能需求，但在一些性能要求极高的应用中，虚拟  DOM 无法进行针对性的极致优化，比如实现类似 Google Earth 的场景。）

### 除了渲染页面，虚拟 DOM 还有哪些应用场景？

记录了真实 DOM 变更，可以应用于**埋点统计** 与**数据记录** 等。

## 与其他框架相比，React 的 diff 算法有何不同？

### 什么是 diff 算法？

diff 算法是指生成更新补丁的方式，主要应用于虚拟 DOM 树变化后，更新真实 DOM。所以 diff 算法一定存在这样一个过程：触发更新 → 生成补丁 → 应用补丁。

### Diff 算法具体的流程

![Diff 算法 流程图.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b5518fe561f4089832c3341c491e2cc~tplv-k3u1fbpfcp-watermark.image?)

![Diff 算法 流程图2.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55ebe5e1826a4cd39d56b7a3688e1c47~tplv-k3u1fbpfcp-watermark.image?)

1. 真实 DOM 与虚拟 DOM 之间存在一个映射关系。这个映射关系依靠初始化时的 JSX 建立完成；
2. 当虚拟 DOM 发生变化后，就会根据差距计算生成 patch，这个 patch 是一个结构化的数据，内容包含了增加、更新、移除等；
3. 最后再根据 patch 去更新真实的 DOM，反馈到用户的界面上。

### React 的 diff 算法

**React 的 diff 算法，触发更新的时机主要在 state 变化与 hooks 调用之后。此时触发虚拟 DOM 树变更遍历，采用了深度优先遍历算法。** 但传统的遍历方式，效率较低。为了优化效率，使用了分治的方式。将单一节点比对转化为了 3 种类型节点的比对，分别是树、组件及元素，以此提升效率。

树比对：由于网页视图中较少有跨层级节点移动，两株虚拟 DOM 树只对同一层次的节点进行比较。

组件比对：如果组件是同一类型，则进行树比对，如果不是，则直接放入到补丁中。

元素比对：主要发生在同层级中，通过标记节点操作生成补丁，节点操作对应真实的 DOM 剪裁操作。

以上是经典的 React diff 算法内容。自 React 16 起，引入了 Fiber 架构。为了使整个更新过程可随时暂停恢复，节点与树分别采用了 FiberNode 与 FiberTree 进行重构。fiberNode 使用了双链表的结构，可以直接找到兄弟节点与子节点。

整个更新过程由 current 与 workInProgress 两株树双缓冲完成。workInProgress 更新完成后，再通过修改 current 相关指针指向新节点。

### Vue 和 Preact 与 React 的 diff 算法进行对比。

Preact 的 Diff 算法相较于 React，整体设计思路相似，但最底层的元素采用了真实 DOM 对比操作，也没有采用 Fiber 设计。**Vue 的 Diff 算法整体也与 React 相似，但是未实现 Fiber 设计。**

然后进行横向比较，**React 拥有完整的 Diff 算法策略，且拥有随时中断更新的时间切片能力，在大批量节点更新的极端情况下，拥有更友好的交互体验。**

**Vue 的整体 diff 策略与 React 对齐，虽然缺乏时间切片能力，但这并不意味着 Vue 的性能更差，** 因为在 Vue 3 初期引入过，后期因为收益不高移除掉了。除了高帧率动画，在 Vue 中其他的场景几乎都可以使用防抖和节流去提高响应性能。

![Diff 算法.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a609fadda4b54c64b33e3b97b0c00684~tplv-k3u1fbpfcp-watermark.image?)

## React 的渲染异常会造成什么后果？

### React 渲染异常

React 渲染异常的时候，在没有做任何拦截的情况下，会出现整个页面白屏的现象。它的成型原因是在渲染层出现了 JavaScript 的错误，导致整个应用崩溃。这种错误通常是在 render 中没有控制好空安全，使值取到了空值。

### 在预防策略上，引入空安全相关的方案

1. 引入外部函数，比如 Facebook 的 idx 或者 Lodash.get。
2. 引入 Babel 插件，使用 ES 2020 的标准——可选链操作符；（推荐，因为这个方案外部依赖少，侵入性小，而且团队内没有 TS 的项目。）
3. 使用 TypeScript，它在 3.7 版本以后可以直接使用可选链操作符。

![React 渲染异常.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0e3e23161284bd0ab671620e2a33ac5~tplv-k3u1fbpfcp-watermark.image?)

## 如何分析和调优性能瓶颈？

Google 的 DoubleClick 小组做过一个研究，证明了网页性能在一定程度上影响用户留存率。他们的研究显示，如果一个移动端页面加载时长超过 3 秒，用户就会放弃而离开。这很有意思，结论非常简单，却是可量化的。

### 衡量工具

#### Lighthouse

Lighthouse 内置在 Chrome 中，开启开发者工具就可以找到它。如下图所示：
![衡量工具.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f9e8cf29a8044fa86f726ed3c34950f~tplv-k3u1fbpfcp-watermark.image?)

这个工具用起来也很简单，点击 generate report，就可以直接生成一份网站性能报告。

**Lighthouse 并不能真实地反映出每个用户的设备的实际性能数据；**
**Lighthouse 的分数反应的是业界的标准，而非项目实际需求的标准。**

#### 网页 APM 工具

1. 其中国际上比较老牌的就是 New Relic，做了很多年，实力十分强悍；
2. 国内的话可以直接考虑使用阿里云的 ARMS，建议你可以看下它的开发文档，有个基本概念，或者用开源项目自建。（太推荐使用开源项目自行搭建，因为数据的采集和处理都会消耗相当多的服务器资源，与成熟的产品服务相比，不管是投入的人力还是服务器运维成本都会更高。）

**无论是什么工具，它们都会对齐 Lighthouse 这样一个业界标准，所以完全不用担心指标会有差异，这是业界公认的一件事。**

### 指标采集

#### FCP（First Contentful Paint）

**首次绘制内容的耗时** 。首屏统计的方式一直在变，起初是通过记录 window.performance.timing 中的 domComplete 与 domLoading 的时间差来完成，但这并不具备交互意义，**现在通常是记录初次加载并绘制内容的时间。**

##### 优化方案

1. 最早的优化方案是绘制一个 Loading 图标，写死在 HTML 的 CSS 里，等 JS 开始执行的时候再移除它。
2. 后来有了骨架屏的概念，在内容还没有就绪的时候，先通过渲染骨架填充页面，给予用户反馈。
3. SSR，也就是走服务端渲染路线，常用的方案有 next.js 等。

#### TTI（Time to Interact）

**是页面可交互的时间。** 通常通过记录 window.performance.timing 中的 domInteractive 与 fetchStart 的时间差来完成。

##### 优化方案

可以优先加载让用户关注的内容，让用户先用起来。策略上主要是将异步加载与懒加载相结合。比如：

1. 核心内容在 React 中同步加载；
2. 非核心内容采取异步加载的方式延迟加载;
3. 内容中的图片采用懒加载的方式避免占用网络资源。

#### Page Load

**页面完整加载时间** 同样可以通过异步加载的方式完成。异步加载主要由 Webpack 打包 common chunk 与异步组件的方式完成

#### FPS

**前端页面帧率。** 通常是在主线程打点完成记录。其原理是 requestAnimationFrame 会在页面重绘前被调用，而 FPS 就是计算两次之间的时间差。

#### 静态资源及 API 请求成功率。

通常是通过 window.performance.getEntries( ) 来获取相关信息。

##### 优化方案

1. 对于静态资源而言，能用 CDN 就用 CDN，可以大幅提升静态资源的成功率。
2. 如果域名解析失败，就可以采取静态资源域名自动切换的方案；还有一个简单的方案是直接寻求 SRE 的协助。
3. 如果有运营商对内容做了篡改，我推荐使用 HTTPS。

![如何分析和调优性能瓶颈？.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52892bc14c9247488cab3e7d88620b45~tplv-k3u1fbpfcp-watermark.image?)

## 如何避免重复渲染？

影响到性能问题通常有两类：

1. 长列表（指渲染了很长的列表，通常有上百甚至上千行数据。解决方案采用**虚拟滚动** ，业界做得比较好的解决方案有 **react-virtualized 和 react-window**）

2. 重复渲染
   > 过早的优化是万恶之源。
   > —— Donald Knuth 《计算机编程艺术》

互联网时代，是一个追求快速交付的时代。保证业务快速上线远比代码质量更为重要。只要业务能跑，性能往往是相对靠后的要求。这就需要我们明确优化时机的问题，即什么时候该做，什么时候不该做。

### 避免重复渲染分为三个步骤：

选择优化时机、定位重复渲染的问题、引入解决方案。

优化时机需要根据当前业务标准与页面性能数据分析，来决定是否有必要。如果卡顿的情况在业务要求范围外，那确实没有必要做；如果有需要，那就进入下一步——定位。

定位问题首先需要复现问题，通常采用还原用户使用环境的方式进行复现，然后使用 Performance 与 React Profiler 工具进行分析，对照卡顿点与组件重复渲染次数及耗时排查性能问题。

通常的解决方案是加 PureComponent 或者使用 React.memo 等组件缓存 API，减少重新渲染。但错误的使用方式会使其完全无效，比如在 JSX 的属性中使用箭头函数，或者每次都生成新的对象，那基本就破防了。

针对这样的情况有三个解决方案：

1. 缓存，通常使用 reselect 缓存函数执行结果，来避免产生新的对象；

2. 不可变数据，使用数据 ImmutableJS 或者 immerjs 转换数据结构；

3. 手动控制，自己实现 shouldComponentUpdate 函数，但这类方案一般不推荐，因为容易带来意想不到的 Bug，可以作为保底手段使用。

通过以上的手段就可以避免无效渲染带来的性能问题了。

![如何避免重复渲染？.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc003646a57f4f1fa409955f8c12b8b8~tplv-k3u1fbpfcp-watermark.image?)

## 如何提升 React 代码可维护性？

![如何提升 React 代码可维护性？.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3a300961eae46e1b75ced66681ba2cb~tplv-k3u1fbpfcp-watermark.image?)

如何提升 React 代码的可维护性，究其根本是考虑如何提升 React 项目的可维护性。从软件工程的角度出发，可维护性包含了可分析性、可改变性、稳定性、易测试性与可维护性的依从性，接下来我从这五个方面对相关工作进行梳理。

可分析性的目标在于快速定位线上问题，可以从预防与兜底两个维度展开工作，预防主要依靠 Lint 工具与团队内部的 Code Review。Lint 工具重在执行代码规划，力图减少不合规的代码；而 Code Review 的重心在于增强团队内部的透明度，做好业务逻辑层的潜在风险排查。兜底主要是在流水线中加入 sourcemap，能够通过线上报错快速定位源码。

可改变性的目标在于使代码易于拓展，业务易于迭代。工作主要从设计模式与架构设计展开。设计模式主要指组件设计模式，通过容器组件与展示组件划分模块边界，隔绝业务逻辑。整体架构设计，采用了 rematch 方案，rematch 中可以设计的 model 概念可以很好地收敛 action、reducer 及副作用，同时支持动态引入 model，保障业务横向拓展的能力。Rematch 的插件机制非常利于做性能优化，这方面后续可以展开聊一下。

接下来是稳定性，目标在于避免修改代码引起不必要的线上问题。在这方面，主要通过提升核心业务代码的测试覆盖率来完成。因为业务发展速度快、UI 变化大，所以基于 UI 的测试整体很不划算，但背后沉淀的业务逻辑，比如购物车计算价格等需要长期复用，不时修改，那么就得加测试。举个个人案例，在我自己的项目中，核心业务测试覆盖率核算是 91%，虽然没完全覆盖，但基本解决了团队内部恐惧线上出错的心理障碍。

然后是易测试性，目标在于发现代码中的潜在问题。在我个人负责的项目中，采用了 Rematch 的架构完成模块分离，整体业务逻辑挪到了 model 中，且 model 自身是一个 Pure Object，附加了多个纯函数。纯函数只要管理好输入与输出，在测试上就很容易。

最后是可维护性的依从性，目标在于建立团队规范，遵循代码约定，提升代码可读性。这方面的工作就是引入工具，减少人为犯错的概率。其中主要有检查 JavaScript 的 ESLint，检查样式的 stylelint，检查提交内容的 commitlint，配置编辑器的 editorconfig，配置样式的 prettier。总体而言，工具的效果优于文档，团队内的项目整体可保持一致的风格，阅读代码时的切入成本相对较低。

## React Hook 的使用限制有哪些？

### React Hooks 的限制主要有两条：

1. 不要在循环、条件或嵌套函数中调用 Hook。

> 因为 Hooks 的设计是基于数组实现。在调用时按顺序加入数组中，如果使用循环、条件或嵌套函数很有可能导致数组取值错位，执行错误的 Hook。当然，实质上 React 的源码里不是数组，是链表。

2. 在 React 的函数组件中调用 Hook。

### 防范措施

因为 React 的内在设计原理，所以我们不可能绕过限制规则，但可以在代码中禁止错误的使用方式。只需要在 ESLint 中引入 eslint-plugin-react-hooks 完成自动化检查就可以了。

![React Hook 的使用限制有哪些.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6639f91d1c614fd4a9bd403d959d1a48~tplv-k3u1fbpfcp-watermark.image?)

## useEffect 与 useLayoutEffect 区别在哪里？

### 共同点

底层的函数签名是完全一致的，都是调用的 mountEffectImpl，在使用上也没什么差异，基本可以直接替换，也都是用于处理副作用。

### 不同点

useEffect 在 React 的渲染过程中是被异步调用的，用于绝大多数场景。

LayoutEffect 会在所有的 DOM 变更之后同步调用，主要用于处理 DOM 操作、调整样式、避免页面闪烁等问题。也正因为是同步处理，所以需要避免在 LayoutEffect 做计算量较大的耗时任务从而造成阻塞。

![useEffect 与 useLayoutEffect 区别在哪里.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24e90d81b8384dff9d2e7578b568e048~tplv-k3u1fbpfcp-watermark.image?)

## 谈谈 React Hook 的设计模式

React Hooks 并没有权威的设计模式，很多工作还在建设中。首先用 Hooks 开发需要抛弃生命周期的思考模式，以 effects 的角度重新思考。过去类组件的开发模式中，在 componentDidMount 中放置一个监听事件，还需要考虑在 componentWillUnmount 中取消监听，甚至可能由于部分值变化，还需要在其他生命周期函数中对监听事件做特殊处理。在 Hooks 的设计思路中，可以将这一系列监听与取消监听放置在一个 useEffect 中，useEffect 可以不关心组件的生命周期，只需要关心外部依赖的变化即可，对于开发心智而言是极大的减负。这是 Hooks 的设计根本。

    在这样一个认知基础上，我总结了一些在团队内部开发实践的心得，做成了开发规范进行推广。

1. 第一点就是 React.useMemo 取代 React.memo，因为 React.memo 并不能控制组件内部共享状态的变化，而 React.useMemo  更适合于 Hooks 的场景。

2. 第二点就是常量，在类组件中，我们很习惯将常量写在类中，但在组件函数中，这意味着每次渲染都会重新声明常量，这是完全无意义的操作。其次就是组件内的函数每次会被重新创建，如果这个函数需要使用函数组件内部的变量，那么可以用 useCallback 包裹下这个函数。

3. 第三点就是 useEffect 的第二个参数容易被错误使用。很多同学习惯在第二个参数放置引用类型的变量，通常的情况下，引用类型的变量很容易被篡改，难以判断开发者的真实意图，所以更推荐使用值类型的变量。当然有个小技巧是 JSON 序列化引用类型的变量，也就是通过 JSON.stringify 将引用类型变量转换为字符串来解决。但不推荐这个操作方式，比较消耗性能。

![谈谈 React Hook 的设计模式.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c56c51064e349ddae2ba147fd8d363b~tplv-k3u1fbpfcp-watermark.image?)

## React-Router 的实现原理及工作方式分别是什么

React Router 路由的基础实现原理分为两种，如果是切换 Hash 的方式，那么依靠浏览器 Hash 变化即可；如果是切换网址中的 Path，就要用到 HTML5 History API 中的 pushState、replaceState 等。在使用这个方式时，还需要在服务端完成 historyApiFallback 配置。

在 React Router 内部主要依靠 history 库完成，这是由 React Router 自己封装的库，为了实现跨平台运行的特性，内部提供两套基础 history，一套是直接使用浏览器的 History API，用于支持 react-router-dom；另一套是基于内存实现的版本，这是自己做的一个数组，用于支持 react-router-native。

React Router 的工作方式可以分为设计模式与关键模块两个部分。从设计模式的角度出发，在架构上通过 Monorepo 进行库的管理。Monorepo 具有团队间透明、迭代便利的优点。其次在整体的数据通信上使用了 Context API 完成上下文传递。

在关键模块上，主要分为三类组件：第一类是  Context 容器，比如 Router 与 MemoryRouter；第二类是消费者组件，用以匹配路由，主要有 Route、Redirect、Switch 等；第三类是与平台关联的功能组件，比如 Link、NavLink、DeepLinking 等。

![React-Router 的实现原理及工作方式分别是什么.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64ca8b97762d46f7894c31bcb55f9e07~tplv-k3u1fbpfcp-watermark.image?)

## React 中你常用的工具库有哪些？

![React 中你常用的工具库有哪些.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03d5520cabf54b8ea410b84c93a6d9ae~tplv-k3u1fbpfcp-watermark.image?)

常用的工具库都融入了前端开发工作流中，所以接下来我以初始化、开发、构建、检查及发布的顺序进行描述。

首先是初始化。初始化工程项目一般用官方维护的 create-react-app，这个工具使用起来简单便捷，但 create-react-app 的配置隐藏比较深，修改配置时搭配 react-app-rewired  更为合适。国内的话通常还会用 dva 或者 umi 初始化项目，它们提供了一站式解决方案。dva 更关心数据流领域的问题，而 umi 更关心前端工程化。其次是初始化库，一般会用到 create-react-library，也基本是零配置开始开发，底层用 rollup 进行构建。如果是维护大规模组件的话，通常会使用 StoryBook，它的交互式开发体验可以降低组件库的维护成本。

再者是开发，开发通常会有路由、样式、基础组件、功能组件、状态管理等五个方面需要处理。路由方面使用 React Router 解决，它底层封装了 HTML5 的 history API 实现前端路由，也支持内存路由。样式方面主要有两个解决方案，分别是 CSS 模块化和 CSS in JS。CSS 模块化主要由 css-loader 完成，而 CSS in JS 比较流行的方案有 emotion 和  styled-components。emotion 提供 props 接口消灭内联样式；styled-components 通过模板字符串提供基础的样式组件。基础组件库方面，一般管理后台使用 Antd，因为用户基数庞大，稳定性好；面向 C 端的话，主要靠团队内部封装组件。功能组件就比较杂了，比如用于实现拖拽的有 react-dnd 和 react-draggable，react-dnd  相对于 react-draggable，在拖放能力的抽象与封装上做得更好，下层差异屏蔽更完善，更适合做跨平台适配；PDF 预览用过 react-pdf-viewer；视频播放用过 Video-React；长列表用过 react-window 与 react-virtualized，两者的作者是同一个人，react-window 相对于 react-virtualized 体积更小，也被作者推荐。最后是状态管理，主要是 Redux 与 Mobx，这两者的区别就很大了，Redux 主要基于全局单一状态的思路，Mobx 主要是基于响应式的思路，更像 Vue。

然后是构建，构建主要是 webpack、Rollup 与 esBuild。webpack 久经考验，更适合做大型项目的交付；Rollup 常用于打包小型的库，更干净便捷；esBuild 作为新起之秀，性能十分优异，与传统构建器相比，性能最大可以跑出 100 倍的差距，值得长期关注，尤其是与 webpack 结合使用这点，便于优化 webpack 构建性能。

其次是检查。检查主要是代码规范与代码测试编写。代码规范检查一般是 ESLint，再装插件，属于常规操作。编写代码测试会用到  jest、enzyme、react-testing-library、react-hooks-testing-library：jest 是 Facebook 大力推广的测试框架；enzyme 是 Aribnb 大力推广的测试工具库，基本完整包含了大部分测试场景；react-testing-library 与 react-hooks-testing-library 是由社区主推的测试框架，功能上与 enzyme 部分有所重合。

最后是发布，我所管理的工程静态资源主要托管在 CDN 上，所以需要在 webpack 中引入上传插件。这里我使用的是 s3-plugin-webpack，主要是识别构建后的静态文件进行上传。

## 如何写一份大厂 HR 满意的简历？

![e152242fdeaf238df486a3e0fb5aa37.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1153f6e7c7a74fa392398c76d2b57a14~tplv-k3u1fbpfcp-watermark.image?)

## 沉淀知识体系，精进个人成长

### 梳理知识体系

首先是对知识的梳理。如何梳理呢？就是要建立结构化的知识体系。往往是一个先对比、再分类的学习模式。新概念的认知往往建立在同类事物的对比基础上，就比 diff 方法，如下图所示，我们通过同类对比的方式理解 React 是怎么做的、有什么优势、更适合什么场景。在这样的基础上，我们再基于应用场景对算法分类，形成了最后的知识体系。

![Cgp9HWAdApCAMNPTAADBuLwQEWc733.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73fb46e1359c486598d658b753fe1300~tplv-k3u1fbpfcp-watermark.image?)

### 锤炼表达技巧（既要重视知识本身，也要重视表达方法。）

其次是表达技巧。我们或多或少都有过这样的经验，我懂这个知识点，但却讲不清楚。让别人能听懂，最重要的点儿在于需要 **结构化表达**。

1.  对概念的“讲，说，理，列”四字口诀；

        a. 讲概念：用简洁的话说清楚该技术是什么。最好能用一句话描述。

        b. 说用途：描述该技术的用途。能够具体结合适合场景，拓展性的描述。

        c. 理思路：梳理该技术的核心思路或运作流程。这个地方可深可浅，如果对其有足够入的了解，建议详细地展开说明。

        d. 优缺点，列一遍：对该技术栈的优缺点进行列举。列举优缺点肯定有与其他技术方横向对比的过程，那么在这个过程中，切忌刻意地踩一捧一，容易引发面试官的感。

![对概念的“讲，说，理，列”四字口诀.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5904f5b5329f487fa39e8d3e2ce6200f~tplv-k3u1fbpfcp-watermark.image?)

2.  选择某技术方案整理的“三步走技巧”；

        a. 一句话解释
        b. 核心概念
        c. 方案对比

![三步走技巧.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80f1165151a345c8a9238bb69d05bef6~tplv-k3u1fbpfcp-watermark.image?)

3.  五种分类方法；

        二分法: 就是将事物分成两类如：人类分为男人与女人。

        矩阵法: 如果我们把二分法的结果再次二分，就可以得到矩阵法。矩阵法有一个非常经典的案例，就是将工作按重要程度与紧急程度划分为四类，分别是：重要紧急、重要不紧急、不重要但紧急、不重要也不紧急。这样可以形成如下图的时间管理矩阵。

    ![时间管理矩阵.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3d1e12110b94a1d822200fbe5f8aa81~tplv-k3u1fbpfcp-watermark.image?)

        公式法: 就是通过公式将几个不太相关的内容放在一起，加强联系。常见的案例就是“天才 = 99% 的汗水 + 1% 的天赋”。你看汗水与天赋本无关联，但一写在公式上就非常有记忆特征了。

        过程法: 是通过梳理流程的方式完成分类。比如前端的开发流程包含了初始化、开发、构建、检查、发布等。

![过程法.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78dc1a9d4da743228e4cf055f474b136~tplv-k3u1fbpfcp-watermark.image?)

        要素法: 需要对事物进行高屋建瓴的抽象，比如营销包含产品、品牌、价格、渠道、推广、促销六大要素。总结要素往往是最难的，对认知水平的要求非常高。

4.  ......

### 横向拓展眼界

最后是建立具备广度的技术视野(有价值的技术视野)。

## 参禅之初，看山是山，看水是水；禅有悟时，看山不是山，看水不是水；禅中彻悟，看山仍然山，看水仍然是水。
