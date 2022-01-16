# 템플릿 메서드 패턴(Template Method Pattern)

## 템플릿 메서드 패턴이란?

특정 작업을 처리하는 일부분을 서브 클래스로 캡슐화하여 전체적인 구조는 바꾸지 않으면서 특정 단계에서 수행하는 내용을 바꾸는 패턴이다. 구체적인 툭정 행동을 서브 클래스에서 구현한다.

## UML

![template method uml](../../../assets/template-method.png)

- AbstractClass 템플릿 메서드를 정의하는 클래스이다. 서브클래스들이 수행해야할 기본 메서드를 정의하고 제공한다.
- ConcreteClass: 재정의가 필요한 메서드를 수행하기 위한 구체 클래스이다. 서브클래스마다 달라진 작업을 수행하기 위한 메서드를 구현한다.

## 장/단점

### 장점

- 중복코드를 줄일 수 있다.
- 자식 클래스의 역할을 줄여 핵심 로직의 관리가 용이하다.

### 단점

### Example

```ts
// Abstract Class
interface IPizza {
  makePizza(): void;
  strechDough(): void;
  spreadSauce(): void;
  putCheese(): void;
  putTopping(): void;
  bake(): void;
}

// Abstract Class
class Pizza implements IPizza {
  makePizza() {
    this.strechDough();
    this.spreadSauce();
    this.putCheese();
    this.putTopping();
    this.bake();
  }

  strechDough() {
    console.log(`Streching dough ...`);
  }

  spreadSauce() {
    console.log('Spreading sauce on dough ...');
  }

  putCheese() {
    console.log('Putting cheese ...');
  }

  putTopping() {
    console.log('Putting some topping ...');
  }

  bake() {
    console.log('Baking pizza in oven ...');
  }
}

// Concrete Class
class PepperoniPizza extends Pizza {
  putTopping() {
    console.log('Putting pepperonies ...');
  }
}

class CheesePizza extends Pizza {
  putTopping() {
    console.log('Putting extra chesse ...');
  }
}

class BulgogiPizza extends Pizza {
  putTopping() {
    console.log('Putting baked bulgogi ...');
  }
}

const order1 = new PepperoniPizza();

const order2 = new BulgogiPizza();

console.log('order1: Pepperoni Pizza');
order1.makePizza();

console.log('order2: Bulgogi Pizza');
order2.makePizza();

/*
  order1 : Pepperoni Pizza
  Streching dough ...
  Spreading sauce on dough ...
  Putting cheese ...
  Putting pepperonies ...
  Baking pizza in oven ...

  order2: Bulgogi Pizza
  Streching dough ...
  Spreading sauce on dough ...
  Putting cheese ...
  Putting baked bulgogi meat...
  Baking pizza in oven ...
*/
```

---

### Reference

- [Design Pattern 템플릿 메서드 패턴이란](https://gmlwjd9405.github.io/2018/07/13/template-method-pattern.html)
- [템플릿 메서드 패턴(Template Method Pattern)](https://www.crocus.co.kr/1531)
