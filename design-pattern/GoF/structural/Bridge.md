# 브릿지 패턴(`Bridge Pattern`)

## 브릿지 패턴이란
- 구현부에서 추상층을 분리하여 각자 독립적으로 변형이 가능하고 확장이 가능하도록 만드는 패
- 기능과 구현에 대해서 두 개를 별도의 클래스로 구현
- 추상화(abstraction)와 구현(implement)이 독립적으로 다른 계층 구조를 가질 수 있고, 클라이언트 어플리케이션으로부터 구현부을 숨기고 싶을 때 사용될 수 있다.

## UML
![img.png](../../../assets/bridge.png)
- Abstraction : 기능 계층의 최상위 클래스이며 추상 인터페이스
- RefindAbstraction : 기능 계층에서 새로운 부분을 확장한 클래스
- Implementor : Abstraction의 기능을 구현하기 위한 인터페이스 정의
- ConcreteImplementor : 실제 기능을 구현하는 클래스

## [Example code]

```ts
interface IDeveloper {
  develop(salary: number);
}

class JuniorDeveloper implements IDeveloper {
  develop(salary: number): void {
    if(salary < 5000){
      console.log('Fucked Code I will destroy software')
      return;
    }
    console.log("Junior Development...");
  }
}

class SeniorDeveloper implements IDeveloper {
  develop(salary: number): void {
    if(salary < 8000){
      console.log('Fucked Code I will destroy software')
      return;
    }
    console.log("Senior Development");
  }
}

type Develop = 'FrontEnd' | 'Backend' | 'DevOps';

interface IDevelopment {
  makeSoftware(salary: number): Develop;
  maintainanceSoftware(): void;
}

class FrontendDevelopment implements IDevelopment {
  constructor(private developer: IDeveloper) {}
  makeSoftware(salary: number): Develop {
    this.developer.develop(salary);
    return 'FrontEnd';
  }
  maintainanceSoftware(): void{
    console.log('Fucking Javascript')
  }
}

class BackendDevelopment implements IDevelopment {
  constructor(private developer: IDeveloper) {}
  makeSoftware(salary: number): Develop {
    this.developer.develop(salary);
    return 'Backend';
  }
  maintainanceSoftware(): void{
    console.log('I Love Typescript')
  }
}

class DevopsDevelopment implements IDevelopment {
  constructor(private developer: IDeveloper) {}
  makeSoftware(salary: number): Develop {
    this.developer.develop(salary);
    return 'DevOps';
  }
  maintainanceSoftware(): void{
    console.log('DevOps is a development culture')
  }
}

const frontendDevelop = new FrontendDevelopment(new JuniorDeveloper());
const backendDevelop = new FrontendDevelopment(new SeniorDeveloper());
const devOpsDevelop = new DevopsDevelopment(new SeniorDeveloper());
console.log(frontend.makeSoftware(5000));
console.log(backend.makeSoftware(5000));
console.log(devOpsDevelop.makeSoftware(8000));
```
---

## 참고자료

- [위키 백과](https://ko.wikipedia.org/wiki/%EB%B8%8C%EB%A6%AC%EC%A7%80_%ED%8C%A8%ED%84%B4)
- [유투브](https://www.youtube.com/watch?v=Dyt1rL3lIlQ)
