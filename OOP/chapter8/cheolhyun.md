# 조합을 이용해 객체 통합하기

- 조합(`composition`)은 멀리 떨어져 있는 부분들을 하나의 복합체로 만드는 작업.
- 객체지향 조합(`object-oriented composition`)을 이용하면 간단하고 독립적인 객체를 보다 크고 복합적인 것으로 통합 가능.
- 조합에서 좀 더 큰 객체는 자신의 부분들 가지고 있는(`has-a`) 관계를 맺음.
- 부분이란 곧 역할.

## 자전거 부품 조합하기

- 상속을 조합으로 변경하는 코드 작성

### `Bicycle` 클래스 업데이트하기

- 현재 `Bicycle` 클래스는 상속 관계 속의 추상화된 상위 클래스.
- 이 클래스를 조합을 이용해서 변경하기 위한 첫 번째 단계: 현재의 코드를 일단 무시하고 자전거가 어떻게 조합되어야 하는지 고민하기.

  - `Bicycle` 클래스는 `spares` 메세지에 반응할 책임이 있음.
  - `spares` 메세지는 예비부품의 목록 반환.
  - 자전거-부품의 관계가 조합의 관계를 취하는 것은 부자연스러워 보임.
    > 자전거의 모든 부품을 들고 있는 객체를 만든다면 `spares` 메세지를 이 객체에 전달 가능할 것으로 예상.

- 새로운 클래스의 이름은 `Parts`.

  - `Parts` 객체는 자전거 부품의 목록을 들고 있을 책임이 있음.
  - 또한 이 부품 중에서 예비부품이 필요한 부품이 무엇인지 알고 있어야 함.
  - 이 객체는 부품들의 모음을 담당하지 하나의 부품을 담당하는 객체가 아님.

- 모든 `Bicycle`은 `Parts` 객체를 필요.
  - "`Bicycle`은 무엇인가?"라는 질문의 답변 중 하나는 "부품을 가지고 있다."

```js
class Bicycle {
  constructor(args = {}) {
    this.size = args.size;
    this.parts = args.parts;
  }

  get spares() {
    // spares를 parts에게 전달(delegate)
    return this.parts.spares;
  }
}
```

- `Bicycle`에게 생긴 세 가지 책임
  1. 자신의`size`를 알아야 함.
  2. 자신의 `Parts`를 들고 있어야 함.
  3. `spares`에 답해야 함.

### `Parts`의 상속 관계 만들기

- 기존 코드를 `Parts`의 새로운 상속 관계로 전환.

```js
class Parts {
  constructor(args = {}) {
    this.chain = args.chain || this.default_chain;
    this.tire_size = args.tire_size || this.default_tire_size;
    this.post_initialize(args);
  }

  get spares() {
    return this.parts.spares;
  }

  get default_tire_size() {
    throw new Error("NotImplementError");
  }

  post_initialize(args) {}

  get local_spares() {
    return {};
  }

  get default_chain() {
    return "10-speed";
  }
}

class RoadBikeParts extends Parts {
  post_initialize(args) {
    this.tape_color = args.tape_color;
  }

  get local_spares() {
    return { tape_color: this.tape_color };
  }

  get default_tire_size() {
    return 23;
  }
}

class MountainBikeParts extends Parts {
  post_initialize(args) {
    this.front_shock = args.front_shock;
    this.rear_shock = args.rear_shock;
  }

  get local_spares() {
    return { rear_shock: this.rear_shock };
  }

  get default_tire_size() {
    return 2.1;
  }
}

const road_bike = new Bicycle({
  size: "L",
  parts: new RoadBikeParts({
    tape_color: "red",
  }),
});
console.log(road_bike.size); // "L"
console.log(road_bike.spares); // { tire_size: 23, chain: "10-speed", tape_color: "red" }

const mountain_bike = new Bicycle({
  size: "L",
  parts: new MountainBikeParts({
    rear_shock: "Fox",
  }),
});
console.log(mountain_bike.size); // "L"
console.log(mountain_bike.spares); // { tire_size: 2.1, chain: "10-speed", rear_shock: "Fox" }
```

- 기존 상속 코드와 클래스 이름, `size` 변수 삭제가 다름.
- 별 차이 없는 리팩터링이지만, `Bicycle` 속에 자전거와 관련된 코드가 사실은 거의 없었다는 점을 보여 줌.

---

## `Parts` 객체 조합하기

- 하나의 부품을 담당하는 클래스의 이름: `Part`
- 부품을 모은 클래스의 이름: `Parts`

> 다른 이름을 선택하는 것도 방법이지만, 자주 발생할 문제  
> 이름에 혼란이 생길 경우 정교한 커뮤니케이션을 조율하여 혼란이 생기지 않도록 해야 함.

### `Part` 만들기

- `Bicycle`은 `Parts`에게 `spares`를 전송.
- `Parts`는 각각의 `Part`에서 `needs_spare`를 전송.
- `Parts`는 `Part`의 조합.
  - `Parts`가 하나 또는 여러 개의 `Part`를 가짐.
  - `Parts` 클래스는 `Part`를 감싸는 단순한 래퍼(`Wrapper`) 클래스에 불과.

```js
class Parts {
  constructor(parts) {
    this.parts = parts;
  }

  get spares() {
    return this.parts.filter((part) => part.needs_spare);
  }
}

class Part {
  constructor(args) {
    this.name = args.name;
    this.description = args.description;
    this.needs_spare = args.needs_spares ?? true;
  }
}

// 개별 Part 생성
const chain = new Part({ name: "chain", description: "10-speed" });
const road_tire = new Part({ name: "tire_size", description: 23 });
const tape = new Part({ name: "tape_color", description: "red" });
const mountain_tire = new Part({ name: "tire_size", description: 2.1 });
const rear_shock = new Part({ name: "rear_shock", description: "Fox" });
const front_shock = new Part({
  name: "front_shock",
  description: "Manutou",
  needs_spare: false,
});

// 로드 자전거용 Parts 생성
const road_bike_parts = new Parts([chain, road_tire, tape]);

// Bicycle 생성
const road_bike = new Bicycle({
  size: "L",
  parts: road_bike_parts,
});

const mountain_bike = new Bicycle({
  size: "L",
  parts: new Parts([chain, mountain_tire, front_shock, rear_shock]),
});
```

- `spares` 메서드가 객체가 아닌 `Part`의 배열 반환.
  - 조합은 `Part` 역할을 수행하는 객체들로 생각하라고 말함.
  - 이 객체들은 `Part` 클래스의 한 종류가 아니라, `Part` 처럼 행동할 뿐임.
  - 이를 위해 `name`, `description`, `needs_spare` 메서드에 꼭 반응해야 함.

### `Parts`를 보다 배열과 비슷하게 만들기

- `Parts`는 배열처럼 보이지만, `length` 메서드를 갖고 있지는 않음.
- 이를 위해 `Parts`에 `length` 메서드를 추가.

  ```js
  class Parts {
    get length() {
      this.spares.length;
    }
  }
  ```

  > 배열의 모든 행동을 기대하게 되므로 다른 방안을 제시해야 함.

- `Array`를 상속 받는 `Parts` 클래스를 만들면, 하위 클래스가 되어 `Parts` 또한 배열이게 됨.

  ```js
  const combo_parts = mountain_bike.parts + road_bike.parts;
  console.log(combo_parts.length); // 7

  combo_parts.spares; // Error!
  ```

  - 하지만 다음과 같이 `Array`의 연산을 수행하면 `Array`를 반환하기 때문에 오해를 불러일으킬 소지가 여전함.

- `length` 메서드가 꼭 필요한 대신 `length` 메서드만 있어도 된다면, 첫 번째 코드로 사용 가능.
- 두 번째 코드의 에러를 감내할 수 있다면, 두 번째 코드로 사용 가능.

> 만약 `Enumerable` 하게 구현하면 기본 배열 연산에는 에러를 발생시키고, `length`, `forEach` 등의 메서드는 사용할 수 있게 됨.

---

## `Parts` 생산하기

- `Bicycle`을 만들기 위해서는, 각 자전거 당 몇 개의 부품이 있어야 하는지 알고 있어야 함.
- 적지 않은 양의 이 지식의 여러 곳에 뿌려지는 것은 좋지 않으며 불필요한 일.

> 자전거의 종류를 설명하고 필요한 부품을 생산해낼 수 있으면 문제 해결.

```js
const road_config = [
  ["config", "10-speed"],
  ["tire_size", 23],
  ["tape_color", "red"],
];

const mountain_config = [
  ["chain", "10-speed"],
  ["tire_size", 2.1],
  ["front_shock", "Manitou", false],
  ["rear_shock", "Fox"],
];
```

> 객체와 달리 이차원 배열은 구조에 대한 정보를 제공하지 않음.

### `PartsFactory`(부품 공장) 만들기

- 다른 객체를 생산하는 객체를 팩토리(`factory`)라고 부름.
- `PartsFactory`는 나열된 `config` 배열 중 하나를 가지고 `Parts`를 생산.
  - 이 과정에서 `Part`도 만들게 됨.

> 이 작업은 프라이빗하게 진행되지만, 공개적인 책임(`public responsibility`)은 `Parts`를 만드는 것.

```js
class PartsFactory {
  static build(config, part_class = Part, parts_class = Parts) {
    return new parts_class(
      config.map(
        (part_config) =>
          new part_class({
            name: part_config[0],
            description: part_config[1],
            needs_spares: part_config[2] ?? true,
          })
      )
    );
  }
}

const road_parts = PartsFactory.build(road_config);
const mountain_parts = PartsFactory.build(mountain_config);
```

- 이 팩토리는 `config` 배열의 구조에 대해 알고 있음.
  - `config` 구조에 대한 지식을 팩토리 안에 넣어두면 `config`가 배열의 형태로 간결하게 표현될 수 있고, 새로운 `Parts`를 만들 때 동일한 코드를 사용할 수 있어 손 쉽다.

> `PartsFactory`와 새로운 설정 값 배열(`config`) 덕분에 `Parts`를 만들기 위한 모든 지식이 고립.

### `PartsFactory` 발전시키기

- `PartsFactory`가 모든 `Part`를 만들고 있기 때문에 `Part` 생성 코드가 `Part`에 들어있을 필요가 없음.
- `Part`에서 중복된 코드를 제거하면 `Part`에는 아무런 코드도 남지 않으므로, 일반 객체로 대체 가능.
- `Part` 클래스를 제거하면 코드가 좀 더 간단해지며 지금처럼 복잡한 코드를 다시 작성할 필요도 없게 됨.

```js
class PartsFactory {
  static build(config, parts_class = Parts) {
    return new parts_class(
      config.map(this.create_part);
      // config.map((part_config) => this.create_part(part_config))
    );
  }

  static create_part(part_config) {
    return {
      name: part_config[0],
      description: part_config[1],
      needs_spares: part_config[2] ?? true,
    };
  }
}

const mountain_parts = PartsFactory.build(mountain_config);
```

- 애플리케이션 전체에서 `needs_spare`의 기본값을 `true`로 할당해주는 곳은 `PartsFactory` 뿐.

> 전체 애플리케이션에서 부품(`Parts`) 생산을 책임지는 곳은 `PartsFactory` 뿐.

---

## 조합된 `Bicycle`

```js
class Bicycle {
  constructor(args = {}) {
    this.size = args.size;
    this.parts = args.parts;
  }

  get spares() {
    // spares를 parts에게 전달(delegate)
    return this.parts.spares;
  }
}

// not enumerable.
class Parts {
  constructor(parts) {
    this.parts = parts;
  }

  get spares() {
    return this.parts.filter((part) => part.needs_spare);
  }
}

class PartsFactory {
  static build(config, parts_class = Parts) {
    return new parts_class(
      config.map(this.create_part);
      // config.map((part_config) => this.create_part(part_config))
    );
  }

  static create_part(part_config) {
    return {
      name: part_config[0],
      description: part_config[1],
      needs_spares: part_config[2] ?? true,
    };
  }
}

const road_config = [
  ["config", "10-speed"],
  ["tire_size", 23],
  ["tape_color", "red"],
];

const mountain_config = [
  ["chain", "10-speed"],
  ["tire_size", 2.1],
  ["front_shock", "Manitou", false],
  ["rear_shock", "Fox"],
];
```

- 기존 `Bicycle` 상속 관계 코드와 매우 비슷해 보이며, 유일한 차이점은 객체를 리턴하던 `spares` 메서드가 `Part`처럼 동작하는 객체들의 배열을 반환한다는 점.

```js
const road_bike = new Bicycle({
  size: "L",
  parts: PartsFactory.build(road_config),
});

const mountain_bike = new Bicycle({
  size: "L",
  parts: PartsFactory.build(mountain_config),
});

const recumbent_config = [
  ["chain", "9-speed"],
  ["tire_size", 28],
  ["flag", "tall and orange"],
];

const recumbent_bike = new Bicycle({
  size: "L",
  parts: PartsFactory.build(recumbent_config),
});
```

- 3줄짜리 설정만으로 리컴벤트 자전거를 만들 수 있게 됨.

#### 집합(`Aggregation`): 새로운 종류의 조합(`Composition`)

- 한 객체가 전달받은 메세지를 다른 객체에게 전달(`forward`)하는 것을 위임(`delegation`)이라고 함.
- 위임은 메세지를 수신한 객체는 메세지를 인지하고, 또한 이 메세지를 어디로 보내야 하는지에 대한 의존성을 만들어 냄.
- 조합은 종종 위임을 사용하는데, 사용하는 위임의 개념에는 몇 가지 함축적 의미가 더 있음.
- 조합된 객체는 잘 정의된 인터페이스를 통해 협업할 줄 아는 여러 부분들로 구성.
- 조합은 가지고 있는 관계(`has-a relationshop`).
- 조합된 객체는 역할의 인터페이스에 의존적.
  - 조합된 객체는 인터페이스를 통해 역할과 소통하기 때문에 새로운 객체가 역할을 수행하기 위해선 역할의 인터페이스만 구현하면 됨.

> 조합이라는 개념을 접하는 대부분의 경우에는 일반적으로 두 객체 사이의 가지고 있는 관계(`has-a`)를 의미.

<br />

- 조금 더 정교하게 정의할 경우, 조합이란 포함된 객체(`contained object`)가 포함하는 객체(`container`)로부터 독립적으로 존재하지 못하는 방식으로 서로 가지고 있는 관계(`has-a`)를 맺고 있다는 뜻.

  > 조합된 객체가 역할들을 가지고 있을 뿐만 아니라, 조합된 객체가 사라지면 역할들 역시 사라진다는 것.

- 일반적인 개념과 정교한 개념 사이의 간극을 집합(`aggregation`)이라는 개념이 채워 줌.
- 집합이란 포함된 객체가 독립적으로 존재할 수 있는 조합.

> 이 두 관계를 모두 지칭하는데 조합이라는 개념을 사용하면 되고 필요할 때는 집합의 개념을 사용하면 됨.

---

## 상속과 조합 중 하나 선택하기

- 고전적 상속은 코드를 배치하는 기술(`code arrangement technique`)이라는 점을 기억.
- 행동들은 각각의 객체들 속에 분산되어 있고, 이 객체들의 클래스 관계에 따라 정의.
- 이 클래스 관계가 메세지의 자동화된 전달을 통해 올바른 행동을 호출.
- 객체들을 상속 관계 속에 배치한 대가로 메세지 전달을 공짜로 얻게 된 상속에서, 조합은 이 대가와 이득을 거꾸로 뒤집은 것.
- 조합을 사용하면 객체들 사이의 관계를 클래스의 상속 관계 속에 적어 놓을 필요가 없음.
  > 객체들은 각자 독립적으로 존재.
- 그 대신 관계를 맺고 있는 객체를 알고 있어야 하며 직접 메세지를 전달.
- 조합은 객체들에게 구조적 독립성을 보장해주지만 이는 직접 메세지를 전달해야 하는 대가를 치를 때만 가능.
- 상속과 조합 사용 고려의 일반적인 원칙
  - 조합이 해결할 수 있는 문제라면 조합 사용.
    - 조합은 상속보다 내재적으로 훨씬 적은 의존성.
    - 상속보다는 조합을 사용하는 것이 대부분 더 나은 결과.
  - 위험 요소가 적지만 그 대가가 클 때는 상속을 선택.

### 상속의 결과 받아들이기

#### 상속의 이점

#### 상속의 비용

### 조합의 결과 받아들이기

#### 조합의 이점

#### 조합의 비용

### 올바른 관계 선택하기
