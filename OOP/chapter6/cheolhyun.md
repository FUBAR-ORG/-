# 상속을 이용해 새로운 행동 얻기

- 대부분의 객체지향 언어들은 코드를 공유할 수 있는 "상속"이라는 기능을 제공.

---

## 고전적 상속 이해하기

- 상속이란, 자동화된 메세지 전달(`automatic message delegation`) 시스템.
- 상속 시스템은 객체가 이해하지 못한 메세지를 어디로 전달(`forward`)해야 하는지를 정의.
- 명시적으로 메세지를 위임(`delegate`)하는 코드를 작성하지 않아도 두 객체 사이의 상속 관계를 정의하면 자동으로 메세지 전달.
- 고전적인 상속 관계는 하위 클래스(`subclass`)를 만드는 것을 통해 정의.
- 메세지는 하위 클래스에서 상위 클래스(`superclass`)로 전달.

---

## 상속을 사용해야 하는 지점을 알기

- 패스트핏에서 로드 자전거를 빌려줌.
- 로드 자전거는 무게가 가볍고, 휘어져있는 핸들바와 얇은 타이어.
- 자전거를 사용할 수 있는 상태로 유지해야 하는 정비공.
- 정비공은 자전거의 종류에 따라 다른 예비 부품을 가지고 다님.

### 구체 클래스에서 시작하기

```ts
interface BicycleAttr {
  size?: string;
  tape_color?: string;
  chain?: string;
  tire_size?: number;
}

class Bicycle {
  public readonly size: string;
  private readonly tape_color: string;

  constructor({ size, tape_color }: BicycleAttr) {
    this.size = size;
    this.tape_color = tape_color;
  }

  get spares(): BicycleAttr {
    return {
      chain: "10-speed",
      tire_size: 23,
      tape_color: this.tape_color,
    };
  }
}

const bike: Bicycle = new Bicycle({ size: "M", tape_color: "red" });
console.log(bike.size);
console.log(bike.spares);
```

- `Bicycle` 인스턴스는 `spares`, `size`, `tape_color` 메세지를 이해할 수 있고, `Mechanic`은 각각의 `Bicycle`에게 어떤 예비 부품이 필요한지 `spares` 메세지를 통해 물어볼 수 있음.

> 우리의 디자인 목표는 패스트핏 애플리케이션에서 마운틴 자전거를 지원하도록 하는 것.

### 자전거 종류 추가하기

- 필요한 대부분의 행동을 구현해 놓은 구체 클래스가 있기 때문에 이 클래스에 코드를 조금 추가해서 문제를 해결하고 싶은 유혹에 빠지기 쉬움.

```ts
type BicycleType = "road" | "mountain";

interface BicycleAttr {
  style?: BicycleType;
  size?: string;
  tape_color?: string;
  chain?: string;
  tire_size?: number;
  front_shock?: string;
  rear_shock?: string;
}

class Bicycle {
  public readonly style: BicycleType;
  public readonly size: string;
  private readonly tape_color: string;
  private readonly front_shock: string;
  private readonly rear_shock: string;

  constructor({
    style,
    size,
    tape_color,
    front_shock,
    rear_shock,
  }: BicycleAttr) {
    this.style = style;
    this.size = size;
    this.tape_color = tape_color;
    this.front_shock = front_shock;
    this.rear_shock = rear_shock;
  }

  get spares(): BicycleAttr {
    if (this.style === "road") {
      return {
        chain: "10-speed",
        tire_size: 23,
        tape_color: this.tape_color,
      };
    } else {
      return {
        chain: "10-speed",
        tire_size: 2.1,
        rear_shock: this.rear_shock,
      };
    }
  }
}

const bike: Bicycle = new Bicycle({
  style: "mountain",
  size: "S",
  front_shock: "Manitou",
  rear_shock: "Fox",
});
console.log(bike.spares);
```

- 세 개의 변수와 변수들에 각각 조응하는 액세서(`accessors`)가 추가됨.
- `spares` 메서드에서 `style` 변수를 확인하는 `if ... else` 문이 포함됨.
- 이 예시는 안티 패턴(`antipattern`)으로 겉보기에는 괜찮을 것 같지만 실제로는 문제가 많은 패턴.
- 더 나은 방식으로 작성할 수 있는 대안도 잘 알려져 있는 패턴을 의미.

<br>

- `spares` 메서드의 `if ... else` 문은 잘못된 `style`이 입력되더라도 어떤 방식으로든 동작.
- 부품 이름을 따서 만든 다른 메서드들은 신뢰 불가.
- `Bicycle`은 하나 이상의 책임을 지고 있음.
- 자기가 어떤 종류인지 알고 있는 어트리뷰트를 확인하는 `if ... else`문을 포함.
  - 오리 타입에서 객체의 클래스를 확인하고 이 객체에게 어떤 메서지를 전송할지 결정하는 `if ... else`문과 유사.

> "나는 네가 누구인지 알고 있다. 때문에 네가 무엇을 하는지도 안다." 이 지식은 수정 비용을 높이는 의존성.

> 이 패턴을 유의. 여기서는 숨겨진 하위 타입(`subtype`), 흔히 하위 클래스(`subclass`)라 말하는 것을 드러냄.

### 숨겨진 타입 찾아내기

- `style`, `type`, `category`과 같은 이름의 변수는 숨겨진 패턴을 찾기 위한 단서.
- 하나의 클래스가 서로 다른, 하지만 연관된 타입을 가지고 있음.

> 이것이 상속을 통해서 해결할 수 있는 문제.

> 밀접히 연관된 타입들이 같은 행동을 공유하고 있지만 특정한 관점에서는 다른 경우.

### 상속을 선택하기

- 객체가 메세지를 처리하는 방법

  1. 직접 메세지를 처리.
  2. 다른 객체가 처리할 수 있도록 메세지를 넘김.

- 상속은 두 객체 사이의 관계를 정의.

  - 첫 번째 객체가 이해할 수 없는 메세지를 수신하면 이 객체는 다음 객체에게 자동으로 메세지 전달.

- 객체가 여러 명의 부모를 갖도록 허용하는 언어 = 다중상속(`multiple inheritance`)을 지원하는 언어.

  > 이는 처리 구현에 대한 우선권 문제 등의 복잡함이 있기에 피하는 것이 좋음.

- 객체가 하나의 부모만 갖도록 허용하는 언어 = 단일상속(`single inheritance`)을 지원하는 언어.

  > 여러 객체지향 언어들은 이러한 방식을 채택.

- 이해하지 못하는 메세지가 상위 클래스의 연쇄를 타고 올라간다는 사실은, 하위 클래스는 상위 클래스의 모든 행동을 갖고 있으며, 추가적인 행동을 더 가지고 있다는 사실을 말해줌.

### 상속 관계 그리기

- 클래스 사이의 관계를 도식화하기 위해 `UML` 다이어그램을 사용할 수 있음.

> `Bicycle`이 `MountainBike`의 상위 클래스라는 사실을 쉽게 도출.

---

## 상속의 잘못된 사용

- 하위 클래스 `MountainBike`를 만들어 보려는 첫 번째 시도

  ```ts
  interface BicycleAttr {
    size?: string;
    tape_color?: string;
    chain?: string;
    tire_size?: number;
  }

  interface MountainBikeAttr {
    front_shock?: string;
    rear_shock?: string;
  }

  class Bicycle {
    public readonly size: string;
    private readonly tape_color: string;

    constructor({ size, tape_color }: BicycleAttr) {
      this.size = size;
      this.tape_color = tape_color;
    }

    get spares(): BicycleAttr {
      return {
        chain: "10-speed",
        tire_size: 23,
        tape_color: this.tape_color,
      };
    }
  }

  class MountainBike extends Bicycle {
    private readonly front_shock: string;
    private readonly rear_shock: string;

    constructor(args: BicycleAttr & MountainBikeAttr) {
      super(args);
      this.front_shock = args.front_shock;
      this.rear_shock = args.rear_shock;
    }

    get spares(): BicycleAttr & MountainBikeAttr {
      return { ...super.spares, rear_shock: this.rear_shock };
    }
  }

  const mountainBike = new MountainBike({
    size: "S",
    front_shock: "Manitou",
    rear_shock: "Fox",
  });
  console.log(mountainBike.size); // "S"
  console.log(mountainBike.spares); // 뒤죽박죽
  ```

  - `Bicycle` 클래스를 바로 상속 받고, 생성자와 `spares`를 구현(재정의, `override`).
  - 별 생각 없이 코드를 작성하면 `MountainBike` 클래스를 기존의 `Bicycle` 클래스 밑에 쑤셔 넣게 됨.
  - `Bicycle` 클래스는 상위 클래스의 용도가 아닌, 구체 클래스이기 때문에 잘못된 정보 제공.
  - `Bicycle` 클래스에 `RoadBike` 클래스의 행동이 포함되어 있음.

  > `Bicycle` 클래스는 `MountainBike`의 형제 클래스에게 어울리는 행동과 `MountainBike`의 부모 클래스에게 어울리는 행동을 모두 갖고 있음. => 부모 클래스일 수 없음.

---

## 추상화 찾아내기

- 기존 `Bicycle` 클래스는 사실 `RoadBike`를 표현하고 있지만, 충분히 잘 사용할 수 있는 네이밍이었음.
- `MountainBike`가 만들어지면서, `Bicycle`이라는 이름은 잘못된 정보를 줌.

  > 이 두 클래스의 이름이 둘 사이 상속 관계를 암시.

- 하위 클래스는 상위 클래스의 특수한 형태(`specialization`).
- `Bicycle`과 협업할 수 있는 모든 객체는 `MountainBike`에 대해 아무 것도 모른 채 `MountainBike`와 협업할 수 있어야 함. => 상속의 기본 원칙.
- 상속이 제대로 작동하는 조건.
  1. 모델링하는 객체들이 명백하게 일반-특수 관계를 따라야 함.
  2. 올바른 코딩 기술을 사용.

### 추상화된 상위 클래스 만들기

> `Bicycle`은 공통된 행동만 가지고 있고, `MountainBike`와 `RoadBike`는 각자의 특수한 행동만 추가.

- `Bicycle`은 추상 클래스가 됨.
- 추상 클래스(`abstract class`)는 상속 받기 위해서 존재.

  - 이 클래스는 하위 클래스들이 공유하는 공통된 행동들의 저장소.
  - 상속받은 하위 클래스들은 구체적인 형태를 제공.

- 하나의 하위 클래스만을 갖는 추상화된 상위 클래스를 만드는 것은 거의 대부분의 경우 말이 안됨.
- 상속 관계는 만드는 데는 높은 비용이 들기 때문에, 비용을 최소화 하기 위해 하위 클래스가 추상 클래스를 필요로 하기 바로 직전에 추상 클래스를 만듬.
- 상속 관계 설정의 잣대는 "새로운 종류가 언제 추가될지", "중복 코드를 관리하는 비용이 얼마인지" 사이에 달려있음.

```ts
class Bicycle {}
class RoadBike extends Bicycle {}
class MountainBike extends Bicycle {}
```

- 이런 재배치가 의미있는 이유는 하위 클래스의 코드를 상위 클래스로 올리는 것이 반대보다 수월하기 때문.

### 추상적인 행동을 위로 올리기

- `size`와 `spares`는 모든 자전거에 적용될 수 있는 메서드. => `Bicycle`의 퍼블릭 인터페이스.

```ts
interface BicycleAttr {
  size?: string;
  chain?: string;
  tire_size?: number;
}

interface RoadBikeAttr {
  tape_color?: string;
}

interface MountainBikeAttr {
  front_shock?: string;
  rear_shock?: string;
}

class Bicycle {
  public readonly size: string;

  constructor({ size }: BicycleAttr) {
    this.size = size;
  }
}

class RoadBike extends Bicycle {
  private readonly tape_color: string;

  constructor(args: BicycleAttr & RoadBikeAttr) {
    super(args);
    this.tape_color = args.tape_color;
  }
}

class MountainBike extends Bicycle {
  private readonly front_shock: string;
  private readonly rear_shock: string;

  constructor(args: BicycleAttr & MountainBikeAttr) {
    super(args);
    this.front_shock = args.front_shock;
    this.rear_shock = args.rear_shock;
  }
}

const roadBike = new RoadBike({
  size: "M",
  tape_color: "red",
});
console.log(roadBike.size); // "M"

const mountainBike = new MountainBike({
  size: "S",
  front_shock: "Manitou",
  rear_shock: "Fox",
});
console.log(mountainBike.size); // "S"
```

- `size`를 처리하는 코드는 `Bicycle` => `RoadBike` => `Bicycle`로 두 번 옮겨짐.
- "모두 아래로 내리고 그 다음에 필요한 것만 위로 올리기" 전략이 이 리팩터링의 핵심.
- "위로 올리기" 전략은 실패했더라도 수정하기 쉬운 문제를 발생시킴.

  - 추상화 하지 않고 빼먹은 코드가 있더라도 다른 하위 클래스가 해당 행동을 필요로 할 때가 오면 보임.
  - 대가가 크기 장ㄶ음.

- 하지만 반대 방식(구체적인 구현을 아래로 내리는 방식)은 작은 실수 한 번으로 구체적인 행동을 상위 클래스에 남겨놓게 됨.

> 하위 클래스는 상위 클래스의 특수화된 형태가 아니므로 상속의 기본 법칙을 위반.

> 새로운 상속 관계를 만드는 리팩터링에서 유념해야하는 기본 원칙은, 구체적인 것을 내리기보다 추상적인 것을 끌어올리는 방식을 취하라는 것.

### 구체적인 것들 속에서 추상적인 것 분리해내기

- `Bicycle`에 `spares` 메서드를 추가할 때, `RoadBike`에 이미 존재하는 코드를 끌어 올리는 것으로는 해결되지 않음.
- `RoadBike`의 `spares` 메서드는 너무 많은 것을 알고 있음.

```ts
interface BicycleAttr {
  size?: string;
  chain?: string;
  tire_size?: number;
}

class Bicycle {
  public readonly size: string;
  public readonly chain: string;
  public readonly tire_size: number;

  constructor({ size, chain, tire_size }: BicycleAttr) {
    this.size = size;
    this.chain = chain;
    this.tire_size = tire_size;
  }
}
```

- 모든 자전거는 `size`, `chain`, `tire_size`가 무엇인지 이해하고 있고 자전거가 어느 하위 클래스에 속하는지에 따라 자신에게 맞는 특수한 값을 이 어트리뷰트에 넣어둘 수 있음.

### 템플릿 메서드 패턴 사용하기

> 기본 구조를 상위 클래스가 정의하고 상위 클래스에서 메세지를 전송하여 하위 클래스의 특수한 값을 얻는 기술을 템플릿 메서드(`template method`) 패턴이라고 부름.

```ts
interface BicycleAttr {
  size?: string;
  chain?: string;
  tire_size?: number;
}

interface RoadBikeAttr {
  tape_color?: string;
}

interface MountainBikeAttr {
  front_shock?: string;
  rear_shock?: string;
}

abstract class Bicycle {
  public readonly size: string;
  public readonly chain: string;
  public readonly tire_size: number;

  constructor({ size, chain, tire_size }: BicycleAttr) {
    this.size = size;
    this.chain = chain || this.default_chain;
    this.tire_size = tire_size || this.default_tire_size;
  }

  get spares(): BicycleAttr {
    return {
      chain: this.chain,
      tire_size: this.tire_size,
    };
  }

  get default_chain(): string {
    return "10-speed";
  }

  get default_tire_size(): number {
    throw new Error("You have to implements get tire size");
  }
}

class RoadBike extends Bicycle {
  private readonly tape_color: string;

  constructor(args: BicycleAttr & RoadBikeAttr) {
    super(args);
    this.tape_color = args.tape_color;
  }

  get spares(): BicycleAttr & RoadBikeAttr {
    return {
      ...super.spares,
      tape_color: this.tape_color,
    };
  }

  get default_tire_size(): number {
    return 23;
  }
}

class MountainBike extends Bicycle {
  private readonly front_shock: string;
  private readonly rear_shock: string;

  constructor(args: BicycleAttr & MountainBikeAttr) {
    super(args);
    this.front_shock = args.front_shock;
    this.rear_shock = args.rear_shock;
  }

  get spares(): BicycleAttr & MountainBikeAttr {
    return {
      ...super.spares,
      rear_shock: this.rear_shock,
    };
  }

  get default_tire_size(): number {
    return 2.1;
  }
}
```

### 모든 템플릿 메서드 구현하기

- `Bicycle`의 생성자는 `default_tire_size` 메서드를 전송하지만 스스로는 구현하고 있지 않음.
- 이 생략이 추후 `RecumbentBike`를 만들고, `RecumbentBike` 메서드에서 `default_tire_size`를 구현하지 않았을 경우, 오류를 발생 시킴.
- 이 경우 `Bicycle`을 작성한 사람은 실수하지 않겠지만, 처음 작성한 사람은 알아채기 힘듬.
- `default_tire_size`와 같은 필수 구현 요소를 명시적으로 구현해야 한다고 말해주는 것은 그 자체로 훌륭한 문서.

> 템플릿 메서드 패턴을 사용할 때는 언제나 호출되는 메서드를 작성하고 유용한 에러 메세지를 제공해야 함.
