# 컴포지트 패턴(`Composite Pattern`)

## 컴포지트 패턴이란?

사용자가 단일 객체와 객체 그룹을 동일하게 다루도록 객체들의 관계를 트리 구조로 구성하여 전체-부분 계층을 표현하는 패턴.

쉽게 말해, 객체 그룹을 조작하는 것과 동일한 방법으로 단일 객체를 조작할 수 있게 하는 방법.

> 단일 객체와 객체 그룹를 같은 타입으로 취급, 트리 구조로 엮는 패턴.

---

## UML

![Composite_pattern_UML](../../../assets/composite_uml.png)

- ### `Component`

  - 구체적인 부분
  - `Leaf` 클래스와 전체에 해당하는 `Composite` 클래스에 공통 인터페이스를 정의

- ### `Leaf`

  - 단일 객체
  - 구체적인 부분 클래스
  - `Composite` 객체의 부품으로 들어감
  - `Component`의 형태로 들어감

- ### `Composite`

  - 전체 클래스
  - 복수 개의 `Component`를 갖도록 정의
  - 그러므로 복수 개의 `Leaf`, 심지어 복수 개의 `Component` 객체를 부분으로 가질 수 있음.

---

## 컴포지트 패턴의 장단점

### 장점

- 객체들이 모두 같은 타입으로 취급되기 때문에 새로운 클래스 추가가 용이.
- 단일 객체와 객체 그룹으로 구성된 하나의 일관된 클래스 정의. 두 객체를 구분하지 않고 일관적 프로그래밍 가능.
- 사용자 코드가 단순.
- 새롭게 정의된 `Composite`나 `Leaf`의 서브 클래스들은 기존에 존재하는 구조들과 독립적으로 동작이 가능.

### 단점

- 설계를 일반화 시켜 객체 간의 구분, 제약이 힘듬.

## 컴포지트 패턴 주 사용처

- 객체들 간에 계급 및 계층 구조가 있고, 이를 표현해야할 때
- 클라이언트가 단일 객체와 객체 그룹을 구분하지 않고 동일한 형태로 사용하고자 할 때
- 전체-부분 관계를 트리 구조로 표현하고 싶을 때
- 전체-부분 관계를 클라이언트에서 부분, 관계 객체를 균일하게 처리하고 싶을 때

> 가장 대표적인 예시로 `Directory-File` 있음.

## Example Code

```ts
interface ComputerDevice {
  getPrice(): number;
  getPower(): number;
}

class Keyboard implements ComputerDevice {
  constructor(private price: number, private power: number) {}

  public getPrice(): number {
    return this.price;
  }

  public getPower(): number {
    return this.power;
  }
}

class Body implements ComputerDevice {
  constructor(private price: number, private power: number) {}
  public getPrice(): number {
    return this.price;
  }

  public getPower(): number {
    return this.power;
  }
}

class Monitor implements ComputerDevice {
  constructor(private price: number, private power: number) {}
  public getPrice(): number {
    return this.price;
  }

  public getPower(): number {
    return this.power;
  }
}

class Computer implements ComputerDevice {
  private components: ComputerDevice[];

  public addComponent(component: ComputerDevice) {
    this.components.push(component);
  }

  public getPrice(): number {
    return this.components.reduce((prev, cur) => prev + cur.getPrice(), 0);
  }

  public getPower(): number {
    return this.components.reduce((prev, cur) => prev + cur.getPower(), 0);
  }
}

const keyboard = new Keyboard(5, 2);
const body = new Body(100, 70);
const monitor = new Monitor(20, 30);

const computer = new Computer();
computer.addComponent(keyboard);
computer.addComponent(body);
computer.addComponent(monitor);

console.log("price", computer.getPrice());
console.log("power", computer.getPower());
```

`OCP`를 준수하게 되며, 부분 객체의 추가나 삭제 등이 있어도 전체 객체의 클래스 코드를 변경하지 않아도 됨.

- `Component`: `ComputerDevice` 인터페이스
- `Leaf`: `Keyboard`, `Body`, `Monitor`, `Speaker` 클래스
- `Composite`: `Computer` 클래스

가장 핵심이 되는 부분은 Component 인터페이스를 정의하고, Leaf와 Composite가 이를 구현하는 것.  
두 클래스가 동등하게 다뤄지는 핵심적인 이유.

> 상위 예제는 `Client`에서 `Leaf` 객체가 자식을 다루는 메서드를 호출할 수 없기 때문에, **타입에 대한 안정성**을 얻게 됨.  
> 자식을 다루는 메서드를 `Composite`가 아닌 `Component`에 정의하게 되면 `Leaf`와 `Composite`를 일관되게 취급할 수 있어 **타입에 대한 일관성**을 얻게 됨.

> 위키에서 컴포지트 패턴은 타입의 안정성보다는 일관성을 더 강조한다고 함.

---

## 참고 자료

- [위키 백과](https://ko.wikipedia.org/wiki/%EC%BB%B4%ED%8F%AC%EC%A7%80%ED%8A%B8_%ED%8C%A8%ED%84%B4)
- [하나씩 점을 찍어 나가며 Blog](https://dailyheumsi.tistory.com/193)
- [gmlwjd9405 Blog](https://gmlwjd9405.github.io/2018/08/10/composite-pattern.html)
- [마이구미의 HelloWorld](https://mygumi.tistory.com/343)
- [Codepen 예시](https://codepen.io/ImagineProgramming/pen/NNgvvp)
- [TypeScript 예시](https://www.sourcecodeexamples.net/2020/08/typescript-composite-pattern-example.html)
