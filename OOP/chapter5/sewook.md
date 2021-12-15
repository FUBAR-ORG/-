# 5장 오리 타입으로 비용 줄이기

> 한 객체가 오리처럼 꽥꽥대고 오리처럼 걷는다면 이 객체는 오리일 것이다.

- 오리 타입은 특정 클래스에 종속되지 않은 퍼블릭 인터페이스다.
- 오리 타입 객체는 객체의 클래스보다는 행동에 의해 규정되는 카멜레온이다.

**우리는 오리 타입을 찾아내고 오리 타입의 특성을 최대한 발휘해 코드를 더 유연하고 수정하기 쉽도록 만들어야한다.**

<br>

## 오리 타입 이해하기

- 타입을 통해 어플리케이션의 내용물이 어떻게 행동하는지 예측할 수 있다.
- 한 객체가 다른 객체의 타입을 알고 있다면 대상 객체가 반응할 메시지를 알고 있는 것이다.
- 객체는 하나의 인터페이스만 반응할 수 있는 것이 아니라 서로 다른 여러 개의 인터페이스를 구현할 수 있다.
- 클래스는 객체가 퍼블릭 인터페이스를 갖추기 위한 수단일 뿐이다.
- 모든 상황에서 객체가 예상한대로 움직이고 모든 객체가 어떤 타입이든 될 수 있다고 믿을 수 있다면 유연하게 디자인할 수 있다.

### 오리 타입 무시하기

```ruby
class Trip
  attr_reader :bicycles, :customers, :vehicle

  # 무엇이든 인자 mechanic이 될 수 있다.
  def prepare(mechanic)
    mechanic.prepare_bicycles(bicycle)
  end
  # ...
end


class Mechanic
  def prepare_bicycles(bicycle)
    bicycles.each {|bicycle| parepare_bicycle(bicycle)}
  end

  def prepare_bicycle(bicycle)
    # ...
  end
end
```

- Trip의 prepare 메서드는 자신이 인자로 받은 mechanic 객체에게 prepare_bicycles 메시지를 전송한다.
- prepare 메서드 자체는 Mechanic 클래스에 의존하고 있지 않지만 prepare_bicycles라는 메서드에 반응할 수 있는 객체를 수신해야 한다는 사실에 의존하고 있다.
- Trip의 prepare 메서드는 여행 준비를 담당하는 객체를 인자로 받았다고 확신하고 있다.

### 문제가 더 복잡해지면

여행 준비에 준비공(mechanic)뿐만 아니라 여행 보조인(trip coodrinator)와 운전수(driver)도 필요하다고 생각해보자.

```ruby
class Trip
  attr_reader :bicycles, :customers, :vehicle

  # 무엇이든 인자 mechanic이 될 수 있다.
  def prepare(preparers)
    preparers.each{|preparer|
      case preparer
        when Mechanic
          preparer.prepare_bicycles(bicycles)
        when TripCoordinator
          preparer.buy_food(customers)
        when Driver
          preparer.gas_up(vehicle)
          preparer.fill_water_tank(vehicle)
        end
    }
  end
end

class TripCoordinator
  def buy_food(customers)
    #...
end

class Driver
  def gas_up(vehicle)
  #...
end


class Mechanic
  def prepare_bicycles(bicycle)
    bicycles.each {|bicycle| parepare_bicycle(bicycle)}
  end

  def prepare_bicycle(bicycle)
    # ...
  end
end
```

- Trip의 prepare 메서드는 Mechanic, TripCoordinateor, Driver 클래스를 참조하고 있고 각 클래스가 구현하고 있는 메서드 이름을 정확히 알고 있기 때문에 위험도가 급격히 상승했다.
- 또다른 여행을 준비하는(preparer) 객체가 필요해지면 case 구분을 위해 새로운 when 절을 추가해야 한다.
- 이러한 코딩 스타일은 유연하지 못한 어플리케이션을 만든다.

### 오리 타입 찾기

- Trip의 prepare 메서드는 여행을 준비하고(prepare_trip) 싶어하며 인자가 여행을 준비하는 객체(Preparer)이기만을 바랄 뿐이다.
- 따라서 Mechanic, TripCoordinator, Driver 모두 Preparer 처럼 행동해야 하며 prepare_trip을 구현하고 있어야 한다.

```ruby
class Trip
  attr_reader :bicycles, :customers, :vehicle

  def prepare(preparers)
    preparers.each {|preparer|
      preparer.prepare_trip(self)
    }
  end
end

# 모든 preparer가 오리 타입일 때 객체들은 모두 prepare_trip 메서드를 이해한다.
class Mechanic
  def prepare_trip(trip)
    trip.bicycles.each {|bicycle|
      prepare_bicycle(bicycle)
    }
  end
  #...
end

class TripCoordinator
  def prepare_trip(trip)
    trip.bicycles.each {|bicycle|
      buy_food(trip.customers)
    }
  end
  #...
end

class Driver
  def prepare_trip(trip)
    vehicle = trip.vehicle
    gas_up(vehicle)
    fill_water_tank(vehicle)

  end
  #...
end
```

이제 Trip의 prepare 메서드를 수정하지 않고도 새로운 Preparer를 추가할 수 있게 되었다.

### 오리 타입을 사용해서 얻을 수 있는 이점

- 구체 클래스에 의존한 코드는 구체적이기 때문에 이해하기 쉽지만 확장하기에 위험하다.
- 오리 타입 코드는 추상적이므로 코드를 이해하기 위해 노력해야 하지만 확장하기 쉽다.
- 이렇듯 오리 타입을 찾으면 코드를 수정하지 않고도 어플리케이션에서 새로운 행동을 이끌어낼 수 있다.

> _폴리모피즘(polymorphism)_
>
> - poly(여러개의) + morphs(형태)
> - 객체지향 프로그래밍에서 폴리모피즘은 같은 메시지에 반응할 수 있는 여러 객체의 능력을 의미한다.
> - 메시지 송신자는 수신자의 클래스에 신경쓸 필요 없이 자신만의 행동을 제공만 하면 된다.
>
> 오리 타입은 이러한 폴리모피즘을 구현하는 방법들 중 하나이다.

<br>

## 오리 타입을 사용하는 코드 작성하기

오리 타입을 사용하려면 클래스를 가로지르는 인터페이스를 사용하면 좋은 지점을 찾아내야 한다.

### 숨겨진 오리 타입 알아보기

다음과 같은 경우에 오리 타입을 적용할 수 있다.

- 클래스에 따라 변경되는 case 구분: 도메인 객체의 클래스 이름에 따라 작동하는 case 구문이 있을 때
- kind_of?와 is_a: if 문을 통해 클래스를 확인하는 구문이 있을 때
- respond_to: 클래스 이름에 의존하는 구문이 있을 때

### 오리 타입을 믿기

- 오리 타입을 적용할 수 있는 코드들은 "네가 누군지 알고 있고 네가 무엇을 하는지도 알고 있다."고 말하고 있다. 이는 협업하는 객체에 믿음이 부족하다는 뜻이다.
- 유연한 애플리케이션은 믿을 수 있는 객체로 이루어져 있다.
- **우리는 코드가 원하는 바를 이용해 오리 타입을 찾고 인터페이스를 정의한 뒤 인터페이스를 구현하고 있는 객체가 제대로 행동하리라 믿어야 한다.**

### 오리 타입 문서 작성하기

- 오리 타입을 만들었다면 문서도 작성하고 오리 타입 퍼블릭 인터페이스를 테스트 해야한다.

### 오리 타입끼리 코드 공유하기

- 오리 타입을 사용하다보면 오리 타입 클래스끼리 코드를 공유할 경우가 필요가 생긴다.

### 현명하게 오리 타입 선택하기

- 새로운 오리 타입을 만들지 말지는 우리의 판단이며 디자인 목표는 비용을 줄이는 것이다.
- 오리 타입을 만들어서 불안정한 의존성을 줄일 수 있다면 오리 타입을 만들어야 한다.

<br>

## 오리 타입을 무서워하지 않고 사용하기

### 정적 타입으로 오리 타입 거부하기

- 타입 확인을 추가하면 할수록 코드는 덜 유연해지고 클래스에 의존하게 된다.
- 오리 타입이 클래스에 대한 의존성을 제거하면 타입 실패 역시 제거된다.
- 오리 타입은 코드가 안정적으로 의존할 수 있는 추상화를 드러내준다.

### 동적 타입 vs 정적 타입

### 동적 타입 받아들이기
