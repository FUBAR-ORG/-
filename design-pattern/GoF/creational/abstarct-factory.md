# 추상 팩토리 패턴(Abstract Factory Pattern)

## 추상 팩토리 패턴이란

추상 팩토리 패턴은 구체적인 클래스에 의존하지 않고 관련성 있는 객체들을 생성하기 위한 인터페이스를 제공하는 디자인 패턴이다.

### 구조

![](https://res.cloudinary.com/practicaldev/image/fetch/s--f5wHcUdU--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://cdn-images-1.medium.com/max/2000/1%2AHq1dVINI67d-_IQjco5-Sw.png)

- AbstractFactory: 제품 생성을 위한 팩토리 클래스의 공통된 인터페이스
- ConcreteFactory: 구체화된 팩토리 클래스, AbsctarctFactory의 메서드의 오버라이드를 통해 제품을 구체적으로 생성하는 팩토리
- AbstractProduct: 제품의 공통된 인터페이스
- ConcreteProduct: ConcreteFactory 클래스에서 생성되는 구체적인 제품
- Client: AbstractFactory와 AbstractProduct에 선언된 인터페이스를 사용

## 추상 팩토리 패턴의 장단점

### 장점

- 동일한 팩토리 클래스에서 생성된 제품들의 일관성이 보장된다.
- 구체적인 클래스의 분리를 통해 생성할 객체의 클래스를 제어할 수 있다.
- 코드의 제거 없이 개방-폐쇄 원칙을 유지하며 새로운 제품군을 만들 수 있기 때문에 clean code가 보장된다.

### 단점

- 새롭게 생성되는 제품은 추상 팩토리가 생성할 수 있는 제품군에 고정되어있기 때문에 새로운 제품을 제공하기 어렵다.
- 코드의 복잡성이 증가되며 필요한 클래스의 수가 많아진다.

## 추상 팩토리 주 사용처

- 관련성 있는 여러 객체들을 일관된 방식으로 생성할 때

```js
class WinFactory {
  createButton() {
    return new WinButton();
  }
}

class MacFactory {
  createButton() {
    return new MacButton();
  }
}

class WinButton {
  paint() {
    console.log('Rendered a Windows button');
  }
}

class MacButton {
  paint() {
    console.log('Rendered a Mac button');
  }
}

class Application {
  factory;
  button;

  constructor(factory) {
    this.factory = factory;
  }

  createUI() {
    this.button = factory.createButton();
  }

  paint() {
    this.button.paint();
  }
}

let factory;
let OS = 'Windows';

if (OS === 'Windows') {
  factory = new WinFactory();
} else if (OS == 'Mac') {
  factory = new MacFactory();
}

const app = new Application(factory);

app.createUI();
app.paint(); // Rendered a Windows button
```

## Example

```ts
interface AbstractProductA {
  usefulFunctionA(): string;
}

export interface AbstractProductB {
  usefulFunctionB(): string;
}

class ConcreteProductA1 implements AbstractProductA {
  public usefulFunctionA(): string {
    return 'The result of the product A1.';
  }
}

class ConcreteProductA2 implements AbstractProductA {
  public usefulFunctionA(): string {
    return 'The result of the product A2.';
  }
}

class ConcreteProductB1 implements AbstractProductB {
  public usefulFunctionB(): string {
    return 'The result of the product B1.';
  }
}

class ConcreteProductB2 implements AbstractProductB {
  public usefulFunctionB(): string {
    return 'The result of the product B2.';
  }
}

export interface AbstractFactory {
  createProductA(): AbstractProductA;
  createProductB(): AbstractProductB;
}

export class ConcreteFactory1 implements AbstractFactory {
  public createProductA(): AbstractProductA {
    return new ConcreteProductA1();
  }

  public createProductB(): AbstractProductB {
    return new ConcreteProductB1();
  }
}

export class ConcreteFactory2 implements AbstractFactory {
  public createProductA(): AbstractProductA {
    return new ConcreteProductA2();
  }

  public createProductB(): AbstractProductB {
    return new ConcreteProductB2();
  }
}

function clientCode(factory: AbstractFactory) {
  const productA = factory.createProductA();
  const productB = factory.createProductB();

  console.log(productA.usefulFunctionA());
  console.log(productB.usefulFunctionB());
}

console.log('Client: Testing client code with ConcreteFactory1');
clientCode(new ConcreteFactory1());

console.log('----------------');

console.log('Client: Testing the same client code with ConcreteFactory2');
clientCode(new ConcreteFactory2());
```

---

## 참고 자료

- [Understanding Design Patterns: Abstract Factory](https://dev.to/carlillo/understanding-design-patterns-abstract-factory-23e7)
- [디자인 패턴 추상 팩토리 패턴 (Abstract Factory Pattern)](https://devowen.com/326)
- [JS ES6 Design Patterns: Factory](https://dev.to/sanderdebr/js-es6-design-patterns-factory-3a3g)
- [Design Pattern 추상 팩토리 패턴이란](https://gmlwjd9405.github.io/2018/08/08/abstract-factory-pattern.html)
