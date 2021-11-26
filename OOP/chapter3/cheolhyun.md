# 의존성 관리하기

- 객체는 현실세계에서 일어나는 문제의 성질을 반영.
- 객체 사이의 상호작용은 문제의 해결책을 제공.
- 어떤 행동을 유발하고자 할 때 객체는 그 행동을 이미 알고 있거나, 상속받았거나, 그 행동에 대해 알고 있는 다른 객체에 대해 알아야 함.
- 하나의 책임만 지고 있는 객체는, 복잡한 작업을 수행하기 위해 다른 객체에 대한 지식. 즉, **의존성**을 만들어 냄.

---

## 의존성 이해하기

> 하나의 객체를 수정했을 때, 다른 객체를 뒤따라 수정해야하는 경우.  
> 뒤따라 수정한 객체가 앞서 수정한 객체에 의존적이라고 한다.

### 의존성이 있다는 것을 알기

- 다른 클래스의 이름이 있다는 것.
- 자기 자신을 제외한 다른 객체에게 전송할 메세지의 이름.
- 메세지가 필요로하는 인자.
- 인자들을 전달하는 순서.

위에 나열한 의존성은 한 클래스를 수정했을 때, 다른 클래스도 수정해야하는 상황을 만듬.  
대부분 불필요하고, 불필요한 의존성은 코드를 **덜 적절하게**(`reasonable`)하게 만듬.

> 우리의 도전과제는 각 클래스가 자신이 해야 하는 일을 하기 위한 최소한의 지식만 알고, 그 외에는 아무 것도 모르도록 하는 **의존성을 관리**하는 것.

### 객체들 간의 결합

의존성은 객체들 간의 **결합**(`couple`)을 만듬. => 결합이 의존성을 낳음.

- 클래스를 수정하면, 의존하고 있는 클래스도 수정을 해야함.
- 클래스를 테스트하면, 의존하고 있는 클래스도 테스트를 해야함.

### 다른 의존성들

- 메세지 연쇄(`message chaining`): 여러 개의 메세지가 여러 단계를 거쳐 연결(`chained`)되어 멀리 있는 객체의 행동을 실행시키려 할 때 가장 심각한 피해를 야기하는 의존성. **데메테르의 원칙(`Law of Demeter`)이 위반**
- 테스트가 코드에 대해 갖는 의존성: 테스트-코드의 지나친 결합은 코드-코드 사이의 지나친 결합과 같은 결과를 낳음. 코드의 수정이 뒤이어 테스트의 수정을 강제하는 의존성.

---

## 약하게 결합된 코드 작성하기

의존성은 본드와 같으며, 심한 본드칠. 즉, 심한 결합과 강한 의존성은 애플리케이션 자체가 단단한 한 덩어리가 되는 결과를 초래.

> 불필요한 의존성이 무엇인지 알고 제거해야 함.

### 의존성 주입하기

```ts
class Wheel {
  constructor(readonly rim: number, readonly tire: number) {}

  get diameter(): number {
    return this.rim + this.tire * 2;
  }
}

class Gear {
  constructor(
    readonly chainring: number,
    readonly cog: number,
    readonly rim: number,
    readonly tire: number
  ) {}

  get ratio(): number {
    return this.chainring / this.cog;
  }

  get gear_inches(): number {
    return this.ratio * new Wheel(this.rim, this.tire).diameter;
  }
}
```

- `Gear` 클래스는 `Wheel` 클래스를 직접 참조하고 있으므로, `Wheel` 클래스 이름 변경 시 `gear_inches` 메서드도 변경되어야 함.
- `gear_inches` 메서드는 `Wheel` 인스턴스의 기어 인치만을 계산하겠다고 명시적으로 선언 중(재사용 힘듬.).

> 고정된 타입에 불필요하게 들러붙어 있는 클래스는 문제가 많음.  
> 중요한 것은 객체의 '클래스가 무엇인지'가 아닌, '우리가 전송하는 **메세지**가 무엇인지'.

- `gear_inches`를 계산하기 위해 `Wheel`의 존재는 알 필요가 없고, `diameter`를 알고 있는 객체만 있으면 됨.

```ts
interface Circle {
  diameter: number;
}

class Gear {
  constructor(
    readonly chainring: number,
    readonly cog: number,
    readonly wheel: Circle
  ) {}

  get ratio(): number {
    return this.chainring / this.cog;
  }

  get gear_inches(): number {
    return this.ratio * this.wheel.diameter;
  }
}
```

- `Wheel` 인스턴스를 `Gear` 인스턴스 밖에서 구현하기 때문에 결합이 없어지고, `Gear` 클래스는 `diameter`를 구현하고 있는 어떠한 클래스와도 협업 할 수 있음.

> 이러한 기술을 **의존성 주입**(`DI, dependency injection`)이라고 부름.

- 클래스의 이름을 알고, 클래스에게 전송해야하는 메세지의 이름을 알아야 하는 의무는 다른 객체가 책임져야 함.
- 즉, 실제 클래스에 대해 알아야 할 책임은 누구에게 있는가를 묻는 것.

### 의존성 격리시키기

불필요한 의존성을 _모두_ 제거하는 것은 기술적으로는 가능해도 현실적으로 불가능.

완벽함을 추구할 수 없다면 전반적인 상태를 발전시켜 조금 나아진 상태로 남겨두는 것이 목표.

> 불필요한 의존성을 제거할 수 없는 경우라면 의존성을 클래스 안에서 격리시켜 놓아야 함.

1. 인스턴스 생성을 격리시키기  
   제약 조건이 너무 많아서 의존성 주입을 할 수 없다면, 새로운 의존 클래스의 인스턴스를 만드는 과정을 격리시켜놓아야 함.  
   이를 통해 의존성을 명시적으로 노출하고, 클래스 내에 스며들지 않게 함.

   - 생성자에 명시(새로운 `Gear` 인스턴스가 생성될 때마다 함께 생성)

   ```ts
   class Gear {
     readonly wheel: Wheel;
     constructor(
       readonly chainring: number,
       readonly cog: number,
       readonly rim: number,
       readonly tire: number
     ) {
       this.wheel = new Wheel(rim, tire);
     }

     get ratio(): number {
       return this.chainring / this.cog;
     }

     get gear_inches(): number {
       return this.ratio * this.wheel.diameter;
     }
   }
   ```

   - 명시적으로 `wheel` 메서드를 정의

   ```ts
   class Gear {
     wheel: Wheel;
     constructor(
       readonly chainring: number,
       readonly cog: number,
       readonly rim: number,
       readonly tire: number
     ) {}

     get ratio(): number {
       return this.chainring / this.cog;
     }

     get gear_inches(): number {
       return this.ratio * this.wheel.diameter;
     }

     createWheel() {
       this.wheel = new Wheel(this.rim, this.tire);
     }
   }
   ```

   - 몇몇 의존성을 줄였고, 의존 사실을 뚜렷하게 명시하였음.
   - 의존성을 감추지 않고, 재사용이 쉽고, 리팩터링하기 쉽게 만듬.
   - 이 변화는 코드를 좀 더 유연(`agile`)하게 만들어 변화에 쉽게 적응할 수 있음.

   > 클래스 이름에 대한 의존성이 간단 명료하고, 잘 정리, 격리되어 있는 클래스는 요구사항 받아들이기 유연.  
   > 외부 이름을 참조하는 지점 격리.

2. 외부로 전송하는 메세지 중 위험한 것들을 격리시키기  
   외부로 전송하는 메세지(`external messages`)는 나 자신이 아닌 객체에게 보내는 메세지.

   ```ts
   class Gear {
     get gear_inches(): number {
       return this.ratio * this.wheel.diameter;
     }
   }
   ```

   - 여기서 `gear_inches`는 `ratio`와 `wheel` 메세지를 자기 자신에게 보내고, `diameter`는 `wheel`에게 보냄.

   > 이 또한 외부에 대한 의존성.

   ```ts
   class Gear {
     get gear_inches(): number {
       return this.ratio * diameter;
     }
     get diameter(): number {
       return this.wheel.diameter;
     }
   }
   ```

   - 이처럼 의존성을 클래스 내부의 메서드 속에 캡슐화시켜 후에도 코드를 `DRY` 하게도 만들 수 있음.
   - 모든 외부 메서드 호출에 대해 선제적으로 대응할 필요는 없음.
   - 코드를 꼼꼼히 살펴본 후 가장 위태로운 의존성을 리팩터링.

### 인자 순서에 대한 의존성 제거하기

송신자가 되어 메세지와 함께 인자를 전송해야할 경우, 인자에 대한 지식은 필수.  
하지만, 인자를 넘기는 작업은 또 하나의 의존성을 만듬.  
많은 메서드 시그니처(`method signatures`)는 인자를 필요로 할 뿐 아니라, 정해진 순서로 전달되기를 기대.

1. 초기화 인자를 해시로 사용하기  
   고정된 인자 대신 옵션을 해시로 만들어서 넘기는 것이 좋음.

   ```ts
   class Gear {
     readonly chainring: number;
     readonly cog: number;
     readonly wheel: Circle;
     constructor(args: any) {
       this.chainring = args.chainring;
       this.cog = args.cog;
       this.wheel = args.wheel;
     }

     get ratio(): number {
       return this.chainring / this.cog;
     }

     get gear_inches(): number {
       return this.ratio * this.diameter;
     }

     get diameter(): number {
       return this.wheel.diameter;
     }
   }
   ```

   - 장점

     1. 인자들의 순서에 대한 의존성 제거.
     2. 해시 키의 이름들이 문서 역할.

   - 추가적인(`Optional`)한 인자들을 받을 때 굉장히 효울적.

2. 기본값을 사용하기

   - `default parameter`를 만듬.

3. 멀티파라미터(`Multiparameter`) 초기화를 고립시키기  
   메서드를 수정할 수 없는 상황에는, 앞의 인자 순서에 대한 의존성을 벗어나는 방법 사용 불가.

   외부 인터페이스와 연결되는 지점을 하나의 메서드로 감싸는 것을 통해 코드를 `DRY`하게 만들 수 있음.
   우리가 만드는 애플리케이션은 우리가 작성한 코드에 의존해야 함.

   ```ts
   import { BrowserWindow, dialog } from "electron";

   class DialogOpener {
     window: BrowserWindow;

     constructor(window: BrowserWindow) {
       this.window = window;
     }

     openMuitiSelectDialog(args: any) {
       dialog.showOpenDialogSync(this.window, {
         title: args.title,
         message: args.message,
         properties: ["openFile", "openDirectory", "multiSelections"],
       });
     }
   }
   ```

   - 외부 인터페이스에 대한 모든 지식을 한 곳에 고립시켜 더 나은 인터페이스를 제공.
   - 이러한 래퍼 클래스는 오로지 다른 클래스의 인스턴스를 생성하기 위해서만 존재.
   - 팩토리(`Factories`): 다른 객체를 만들기 위해 존재하는 객체.

   > 변경할 수 없는 외부 인터페이스에 의존해야하는 상황에 좋은 기술.  
   > 외부에 대한 의존성이 코드에 스며들지 않도록 래퍼 메서드를 만들어서 보호.

---

## 의존성의 방향 관리하기

- 모든 의존성은 방향이 있음.

### 의존성의 방향 바꾸기

- 뒤바뀐 의존성 예시

```ts
class Gear {
  constructor(readonly chainring: number, readonly cog: number) {}

  gear_inches(diameter: number): number {
    return this.ratio * diameter;
  }

  get ratio(): number {
    return this.chainring / this.cog;
  }
}

class Wheel {
  readonly gear: Gear;
  constructor(
    readonly rim: number,
    readonly tire: number,
    readonly chainring: number,
    readonly cog: number
  ) {
    this.gear = new Gear(chainring, cog);
  }

  get diameter(): number {
    return this.rim + this.tire * 2;
  }

  get gear_inches(): number {
    return this.gear.gear_inches(this.diameter);
  }
}
```

- `Wheel`이 `Gear`와 `gear_inches`에 의존하고 있음.

### 의존성의 방향 결정하기

#### **자기 자신보다 덜 변하는 사람에게 의존해야함.**

- 어떤 클래스는 다른 클래스에 비해 요구사항(`requirements`)이 더 자주 바뀜.
- 구체 클래스(`concrete classes`)는 추상 클래스(`abstract classes`)보다 수정해야하는 경우가 빈번히 발생.
- 의존성이 높은 클래스를 변경하는 것은 코드의 여러 곳에 영향을 미침.

---

## 요약
