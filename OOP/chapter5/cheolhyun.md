# 오리 타입으로 비용 줄이기

- 객체 지향 디자인의 목표는 코드의 수정 비용을 줄이는 것.
- 디자인의 핵심은 메세지이고, 엄격하게 정의된 퍼블릭 인터페이스를 구축하는 과정을 종합한 강력한 디자인 기술을 통해 수정 비용을 더욱 줄일 수 있음.
- 오리타입(`duck typing`)
  - 특정 클래스에 종속되지 않은 퍼블릭 인터페이스로, 여러 클래스를 가로 지름.
  - 클래스에 대한 값비싼 의존을 메세지에 대한 부드러운 의존으로 대치.
    > 애플리케이션을 굉장히 유연하게 만듬.

---

## 오리 타입 이해하기

- 프로그래밍 언어들은 "타입"이라는 개념을 통해 변수의 내용물이 어떤 카테고리에 속하는지 설명.
- 객체들의 타입을 예측할 수 있는 이유는 객체들의 퍼블릭 인터페이스를 믿기 때문.
  - 한 객체가 다른 객체의 타입을 알고 있다면 대상 객체가 반응할 수 있는 메세지를 알고 있는 것.
- 하지만 어떤 객체가 하나의 인터페이스에만 반응할 수 있다고 생각할 필요는 없음.
- 클래스는 객체가 퍼블릭 인터페이스를 갖추기 위한 하나의 수단.
- 특정 클래스에 종속되지 않은 퍼블릭 인터페이스를 정의할 수 있고, 이는 여러 클래스들 사이를 관통해서 존재.

> 객체가 무엇인가가 아니라 어떻게 행동하는지가 중요.

- 클래스를 가로지르는 타입(`across class types`). 즉, 오리 타입은 명시적이고 잘 정리된 계약서와 같은 퍼블릭 인터페이스를 가지고 있어야 함.

### 오리 타입 무시하기

```js
class Trip {
  bicycles;
  customers;
  vehicle;
  constructor() {}

  // 무엇이든 이 mechanic의 인자의 클래스가 될 수 있음.
  perpare(mechanic) {
    mechanic.prepare_bicycles(this.bicycles);
  }
}

// 우연히 아래의 클래스 인스턴스를 넘겨준다면, 제대로 동작.
class Mechanic {
  prepare_bicycles(bicycles) {
    bicycles.forEach((bicycle) => this.prepare_bicycle(bicycle));
  }
  prepare_bicycle(bicycle) {}
}
```

- `prepare` 메서드 자체는 `Mechanic` 클래스에 의존하고 있지 않음.
- `prepare_bicycles`라는 메서드에 반응할 수 있는 객체를 수신해야 한다는 사실에 의존.

> `Trip`의 `prepare` 메서드는 여행 준비를 담당하는 객체를 인자로 받았다고 확신.

### 문제가 더 복잡해지면

- 요구사항 변경
  - 여행 준비에 정비공(`mechanic`) 뿐만 아니라, 여행 보조인(`trip coordinator`)와 운전수(`driver`)도 필요.

```js
class Trip {
  bicycles;
  customers;
  vehicle;
  constructor() {}

  perpare(preparers) {
    preparers.forEach((preparer) => {
      if (preparer instanceof Mechanic) {
        preparer.prepare_bicycles(this.bicycles);
      } else if (preparer instanceof TripCoordinator) {
        preparer.buy_food(this.customers);
      } else if (preparer instanceof Driver) {
        preparer.gas_up(this.vehicle);
        preparer.fill_water_tank(this.vehicle);
      }
    });
  }
}

class TripCoordinator {
  buy_food(customers) {}
}

class Driver {
  gas_up(vehicle) {}
  fill_water_tank(vehicle) {}
}
```

- 반영된 코드에서 `Trip`의 `prepare` 메서드는 세 개의 서로 다른 클래스를 참조하고, 각 클래스가 구현하고 잇는 메서드의 이름을 정확히 알고 있어 위험도가 급격히 상승.
- 프로그래머가 애플리케이션에 어떤 클래스가 있는지 잘 모르고 중요한 메세지를 파악하지 못 했을 때 나오는 코드.
- `buy_food`, `gas_up`, `fill_water_tank` 같은 메서드는 `prepare` 메서드가 필요로 하는 행동.

  - 이 행동을 실행하는 가장 명확한 방법은 메세지를 전송하는 것이지만, 의존성 분출을 목격하게 됨.
  - 또한 이런 코딩 스타일 자체가 재생산되는 문제점.

> 시퀀스 다이어그램은 언제나 코드보다 간단해야함. 그렇지 않다면 디자인에 뭔가 문제가 있다는 뜻.

### 오리 타입 찾기

- `Trip`의 `prepare` 메서드는 하나의 목표를 이루기 위해 협업하는 객체.
- `prepare`가 무엇을 원하는지 집중.
  - `prepare` 메서드의 인자는 여행을 준비하는 객체(`Preparer`)이기만을 바람.
  - 메서드의 모든 인자인 `Preparer`가 `prepare_trip`을 이해할 수 있기를 바람.
    > `Preparer`는 구체적으로 전재하지 않는 추상적인 객체지만, 인자들이 `Preparer`의 퍼블릭 인터페이스를 구성하고 있다고 믿어야 함.
- `Mechanic`, `TripCoordinator`, `Driver`는 모두 `Preparer`처럼 행동해야 함.
  > `prepare_trip`을 구현하고 있어야 함.

```js
class Trip {
  bicycles;
  customers;
  vehicle;
  constructor() {}

  perpare(preparers) {
    preparers.forEach((preparer) => {
      preparer.prepare_trip(this);
    });
  }
}

// Preparer가 오리 타입일 때, 이 객체들은 모두 prepare_trip 메서드를 이해함.
class Mechanic {
  prepare_trip(trip) {
    this.prepare_bicycles(trip.bicycles);
  }

  prepare_bicycles(bicycles) {
    bicycles.forEach((bicycle) => this.prepare_bicycle(bicycle));
  }
  prepare_bicycle(bicycle) {}
}

class TripCoordinator {
  prepare_trip(trip) {
    this.buy_food(trip.customers);
  }

  buy_food(customers) {}
}

class Driver {
  prepare_trip(trip) {
    const vehicle = trip.vehicle;
    this.gas_up(vehicle);
    this.fill_water_tank(vehicle);
  }

  gas_up(vehicle) {}
  fill_water_tank(vehicle) {}
}
```

> 손쉽게 새로운 `Preparer` 추가 가능.

### 오리 타입을 사용해서 얻을 수 있는 이점

- 오리 타입으로 작성된 코드에는 나름의 대칭성이 있음.

- 최초 코드에서 `prepare` 메서드는 구체 클래스에 의존.

  > 구체적이기 때문에 이해하기 쉽지만 확장하기에는 위험.

- 마지막 코드에서 `prepare` 메서드는 오리 타입에 의존.

  > 추상적이기 때문에 코드를 이해하기는 조금 어렵지만 손쉬운 확장성을 제공.

#### 폴리모피즘(`polymorphism`)

- 여러 형태를 가지고 있는 상태.
- 객체 지향 프로그래밍에서 같은 메세지에 반응할 수 있는 여러 객체의 능력.
- 메세지의 송신자는 수신자의 클래스를 신경 쓸 필요가 없음.
- 수신자는 주어진 행동에 걸맞는 자신만의 행동을 제공.
- 하나의 메세지가 여러 개의 형태를 갖게 됨.
- 오리 타입, 상속 등을 이용해서 구현.
- 폴리모픽 메서드는 암묵적인 합의를 중시. 구현하고 있는 모든 객체는 서로가 서로를 대체(상호 대체적).

---

## 오리 타입을 사용하는 코드 작성하기

- 클래스를 가로지르는 인터페이스를 사용하면 좋은 지점을 찾아내는 안목 필요.

### 숨겨진 오리 타입 알아보기

- 클래스에 따라 변경되는 `case` 구분
- `kind_of?`와 `is_a?`
- `responds_to?`

[루비에서 kind_of?, is_a?, instance_of?](https://hashcode.co.kr/questions/1314/ruby%EC%97%90-kind_of-instance_of-is_a-%EC%9D%98-%EC%B0%A8%EC%9D%B4%EC%A0%90)

[루비에서 respond_to?](https://apidock.com/ruby/Object/respond_to%3F)

#### 클래스에 따라 변경되는 `case` 구분

- 오리 타입이 숨겨져 있다고 알려주는 가장 일반적이고 명확한 패턴.
- 이 패턴은 모든 `Preparer`가 무언가를 공유하고 있다는 사실을 바로 알ㄹ려줌.

#### `kind_of?`와 `is_a?`

- `kind_of?`, `is_a?` 도 `case`로 구분하는 것과 차이가 없음.

> 위 두 가지는 `JavaScript`의 `instanceof`와 같음.

#### `responds_to?`

```js
if (typeof preparer.prepare_bicycles === "function") {
  preparer.prepare_bicycles(this.bicycles);
} else if (typeof preparer.buy_food === "function") {
  preparer.buy_food(this.customers);
} else if (typeof preparer.gas_up === "function") {
  preparer.gas_up(this.vehicle);
  preparer.fill_water_tank(this.vehicle);
}
```

- 의존성의 개수가 아주 조금 줄어들기는 했지만, 여전히 많은 의존성 보유.
- 클래스 이름은 없어졌지만 여전히 클래스에 얽혀 있음.
- 역시 특정한 클래스를 꼭 필요함.

> 다른 객체를 믿기보다는 명령하려 듬.

### 오리 타입을 믿기

- 숨겨진 오리 타입은 "나는 네가 누구인지 알고 있고, 그렇기 때문에 네가 무엇을 하는지도 알고 있다."
- 데메테르의 원칙을 위반했을 때처럼 이런 스타일의 코드는 어떤 객체 하나를 놓치고 있다는 사실을 말함.
  > 퍼블릭 인터페이스를 발굴해내지 못한 어떤 객체가 있다는 뜻.

> 유연한 어플리케이션은 믿을 수 있는 객체로 이루어져있음.

### 오리 타입 문서 작성하기

- 가장 단순한 형태의 오리 타입은 퍼블릭 인터페이스에 대한 합의만으로 존재.
- `Preparer`는 추상적이기에 매우 강력한 디자인 도구가 될 수 있지만, 이 추상성 자체가 코드 속에서 오리 타입을 잘 드러나지 않게 됨.
- 오리 타입을 만들었다면 문서도 작성하고 오리 타입의 퍼블릭 인터페이스 역시 테스트해야 함.

> 오리 타입은 문서를 작성해야하는데, 좋은 테스트는 그 자체로 최고의 문서가 될 수 있으므로, 테스트를 잘 작성해야 함.

### 오리 타입끼리 공유하기

- 오리 타입은 인터페이스만 공유할 뿐, 그 구현은 공유하지 않음.
- 하지만 오리 타입 클래스 끼리 종종 같은 행동을 공유할 필요가 있다는 사실을 발견.

> 코드를 공유하는 오리 타입을 작성해야 함.

### 현명하게 오리 타입 선택하기

```js
function first(...args) {
  if (args.some((element) => element !== undefined)) {
    if (typeof args[0] === "number" || (loaded && !args[0] instanceof Hash)) {
      // to_a.first(*args);
    } else {
      // apply_finder_options(args.first).first
    }
  } else {
    // find_first
  }
}
```

[Ruby on Rails ActiveRecord > FinderMethod](https://api.rubyonrails.org/v6.1.4/classes/ActiveRecord/FinderMethods.html)

[루비에서 .any?](https://apidock.com/ruby/Enumerable/any%3F)

> 코드가 확인하고 있는 클래스의 안정성에 따라 선택 결과가 다름.

- 수신된 객체의 클래스를 확인하고 이 결과에 따라 어떤 메세지를 전송할지 결정하는 방식이 애플리케이션에 문제가 있다는 사실을 알려주는 신호.
- 하지만 이 코드는 코드가 확인하고 있는 클래스가 매우 안정적이기 때문에 안전한 의존임.
- 오리 타입을 만들어서 불안정한 의존성을 줄일 수 있다면, 만들면 됨.

---

## 오리 타입을 무서워하지 않고 사용하기

### 정적 타입으로 오리 타입 거부하기

- 대부분의 정적 타입 언어는 변수나 메서드 파라미터의 타입을 명시적으로 선언할 것을 요구.
- 동적 타입 언어에서는 이런 선언을 생략.

- 정적 언어
  - 타입 확인을 추가할수록 코드는 점점 덜 유연해지고 점점 더 클래스에 의존.
  - 새로운 의존성은 또 다시 타입 실패를 만들어 내고, 이 실패에 대응해서 새로운 타입 확인을 추가.

> 오리 타입이 클래스에 대한 의존성을 제거하면 타입 실패 역시 제거.

> 오리 타입은 코드가 안정적으로 의존할 수 있는 추상화를 드러내줌.

### 정적 타입 vs 동적 타입

- 정적 타입의 이점

  - 컴파일 시점에 컴파일러가 타입 에러를 잡아냄.
  - 눈에 보이는 타입 정보가 문서의 역할.
  - 컴파일된 코드는 빠르게 동작할 수 있도록 최적화.

- 정적 타입의 단점

  - 컴파일러가 타입을 확인하지 않으면 런타임 타입 에러(`runtime typ errors`)가 발생.
  - 프로그래머는 전체 맥락에서 객체의 타입을 추측할 수 없고, 코드를 이해하지 못 함.
  - 이러한 최적화를 거치지 않으면 애플리케이션이 너무 느릴 것.

- 동적 타입의 이점

  - 코드가 해석(`interpreted`)되면 동적으로 로드(`load`)될 수 있음.
  - `compile/make` 과정을 거칠 필요가 없음.
  - 소스 코드에 명시적인 타입 정보를 포함할 필요가 없음.
  - 메타 프로그래밍이 손쉬움.

- 동적 타입의 이점의 강화

  - `compile/make` 과정이 없으면 전체 애플리케이션 개발이 보다 빠르게 진행.
  - 타입을 선언하는 코드가 없으면 프로그래머가 코드를 이해하기 쉬움.
  - 맥락 속에서 객체의 타입을 추측할 수 있음.
  - 메타 프로그래밍은 프로그래밍 언어의 바람직한 기능.

### 동적 타입 받아들이기

- 동적 타입 애플리케이션이 충분한 성능을 낼 수 있을 만큼 최적화되지 않는다면, 정적 타입만이 대안.
- 타입 선언이 문서의 의미를 갖는다는 것은 주관적.
- 메타 프로그래밍(코드를 작성하는 코드 짜기) 또한 주관적으로 개개인마다 확고한 입장.
- 메타 프로그래밍은 잘못 사용하면 매우 위험하지만, 현명하게 사용한다면 큰 이득.

- `complie/make` 과정의 이점

  - 컴파일러는 의도치 않은 타입 에러를 확실히 방지.
  - 컴파일러가 도와주지 않으면 타입 에러는 분명 발생.

- 컴파일러는 의도치 않는 타입 에러로부터 개발자를 구하지 못함.

  - 변수의 타입 변형(`casting`)을 지원하는 모든 언어는 타입 에러의 위험에 노출.
  - 타입 변형을 사용하는 순간 모든 확신은 사라짐.

- 실제 개발 현장에서 컴파일러가 방지해 줄 런타임 타입 에러(`runtime type errors`)는 거의 발생하지 않음.

> 오리 타입을 사용하기 위해서는 동적 타입을 받아들여야만 함.

---

## 요약

- 객체 지향 디자인의 핵심에는 메세지가 있음.
- 메세지는 퍼블릭 인터페이스를 따라 객체들 사이를 오감.
- 오리 타입은 이 퍼블릭 인터페이스를 클래스로부터 분리.
- "객체가 누구인지"가 아니라 "객체가 무엇을 하는지"에 따라 가상의 타입을 만듬.
- 오리 타입은 오리 타입이 없었다면 발견하지 못 했을 추상화를 볼 수 있게 해줌.

> 오리 타입과 같은 추상화에 의존할 때 애플리케이션의 위험성은 줄어들고 유연성은 증가하며, 유지보수 비용은 줄고 쉽게 수정할 수 있게 됨.
