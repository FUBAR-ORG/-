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
