# 싱글톤 패턴(`Singleton Pattern`)

## 싱글톤 패턴이란?

생성자가 여러 차례 호출되더라도, 실제 생성되는 객체는 하나이고, 최초 생성 이후에 호출된 생성자는 최초의 생성자가 생성한 객체를 리턴하는 패턴.

### 싱글톤 패턴의 특징

- 객체 자체에 접근이 불가능 해야 함.
- 객체에 대한 접근자(비공개 멤버: 클로저)를 사용해 실제 객체를 제어할 수 있음.
- 객체는 단 하나만 만들어지며, 해당 객체를 공유함.

애플리케이션이 시작될 때 최초 한 번만 메모리 할당함.

> 단 하나의 인스턴스를 생성해 사용함.

---

## UML

![img.png](../../../assets/singleton_uml.png)

---

## 싱글톤 패턴의 장단점

### 장점

- 메모리 낭비를 방지(생성된 인스턴스를 활용하여 속도 측면 또한 이점)
- 전역성을 띄기에 공유가 용이
- 인스턴스가 한 개만 존재하는 것을 보증

### 단점

- 멀티 쓰레드 등에서 동기화가 필수(동시성 문제를 해결해야 함)
- 자식 클래스를 만들 수 없음
- 내부 상태를 변경하기 어려움(`side effects` 발생, 유연성이 많이 떨어짐)
- 너무 많은 일을 할 경우 다른 클래스 간의 결합도가 높아지기 때문에 수정이 어려워짐
- 클라이언트가 `Singleton` 클래스에 의존하게 됨
- 자원을 공유하기 때문에 테스트 하기가 어려움
- `SOLID` 원칙 중 `DIP`를 위반, `OCP` 원칙 또한 위반할 가능성 多

---

## 싱글톤 패턴 주 사용처

공통된 객체를 여러 개 생성해서 사용해야 하는 상황에 많이 사용.

인스턴스가 절대적으로 한 개만 존재하는 것을 보증하고 싶을 경우 사용.

`JavaScript`에서 사용하는 **객체 리터럴**이 싱글턴 패턴의 대표적인 예시.

정적 메서드로만 이루어진 정적 클래스를 사용하면 싱글턴과 동일한 효과를 얻을 수 있음.

---

## Example Code

### `JavaScript` Example

- `IIFE` 적용

```js
var Singleton = (function () {
  var instantiaed;

  function init() {
    return {
      publicMethod: function () {
        return "Hello World!";
      },
      publicProp: "Singleton Property",
    };
  }

  return {
    getInstance: function () {
      if (!instantiaed) {
        instantiaed = init();
      }
      return instantiaed;
    },
  };
})();

const first = Singleton.getInstance();
const second = Singleton.getInstance();
console.log(first === second); // true
```

- `ES7` 이후의 `static` 키워드와 클래스 적용

```ts
class Singleton {
  private static instance: Singleton;

  private constructor(public name: string) {}

  public static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton("object");
    }
    return Singleton.instance;
  }
}

const bad_case = new Singleton("Error!");
const good_case = Singleton.getInstance();
```

---

### `JAVA` Example

- static block

```java
public class ExampleClass {
    //Instance
    private static ExampleClass instance;

    //private construct
    private ExampleClass() {}

    static {
        try {
            instance = new ExampleClass();
        } catch(Exception e) {
            throw new RuntimeException("Create instace fail. error msg = " + e.getMessage() );
        }
    }

    public static ExampleClass getInstance() {
        return instance;
    }
}
```

- lazy

```java
public class ExampleClass {
    //Instance
    private static ExampleClass instance;

    //private construct
    private ExampleClass() {}

    public static ExampleClass getInstance() {
        if (instance == null) {
            instance = new ExampleClass();
        }
        return instance;
    }
}
```

- Thread safe + lazy

```java
public class ExampleClass {
    //Instance
    private static ExampleClass instance;

    //private construct
    private ExampleClass() {}

    public static synchronized ExampleClass getInstance() {
        if (instance == null) {
            instance = new ExampleClass();
        }
        return instance;
    }
}
```

- Holder

```java
public class ExampleClass {

    //private construct
    private ExampleClass() {}

    private static class InnerInstanceClazz() {
        private static final ExampleClass instance = new ExampleClass();
    }

    public static ExampleClass getInstance() {
        return InnerInstanceClazz.instance;
    }
}
```

---

## 참고자료

- [위키 백과](https://ko.wikipedia.org/wiki/%EC%8B%B1%EA%B8%80%ED%84%B4_%ED%8C%A8%ED%84%B4)
- [elfinlas Blog](https://elfinlas.github.io/2019/09/23/java-singleton/)
- [niceman Tistory Blog](https://niceman.tistory.com/30)
- [정 아마추어 Tistory Blog](https://jeong-pro.tistory.com/86)
- [yamoo9 Blog](https://yamoo9.gitbook.io/typescript/classes/singleton)