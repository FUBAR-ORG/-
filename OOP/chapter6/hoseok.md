# 6장 상속을 이용해 새로운 행동 얻기
---

## 6.1 고전적 상속 이해하기
---
- 기본적으로 상속이란 자동화된 메시지 전달 ( automatic message delegation ) 시스템임
- 상속 시스템은 객체가 이해하지 못한 메시지를 어디로 전달해야 하는지를 정의함
- 명시적으로 메시지를 위임하는 코드를 작성하지 않아도 두 객체 사이의 상속 관계를 정의하면 자동으로 메시지 전달이 이루어짐

## 6.2 상속을 사용해야 하는 지점을 알기
---
- 상속이 필요한 곳이 어디인지 아는 것이 첫번째 과제
- 예시
  - 패스트핏에서 로드 자전거를 빌려준다는 가정
  - 로드 자전거는 무게가 가볍고, 휘어져있는 핸들바(드롭바) 얇은 타이어를 장착한 자전거이며 도로를 달리기 적합함
  - 정비공은 자전거를 사용할 수 있는 상태로 유지시키는 역할
  - 여기서 정비공은 예비부품을 가지고 다니며, 자전거 종류마다 부품이 다름

### 6.2.1 구체 클래스에서 시작하기
---
- 예시
  - 자전거에는 전반적인 크기, 행들바 테이프 색상, 타이어 크기, 체인 종류가 있음
  - 타이어와 체인, 핸들바 테이프는 반드시 필요한 부품임

```cpp
class Bicycle
{
private:
    int tire_size;
    string size;
    string chain;
    string tape_color;

public:
    Bicycle(string size, string tape_color)
    :size(size),
     tape_color(tape_color)
    {
        chain = "10-speed";
        tire_size = 23;
    }

    //모든 자전거가 동일한 크기의 타이어와 체인을 기본값으로 갖는다.
    void spares()
    {
        cout << tire_size << endl;
        cout << chain << endl;
        cout << tape_color << endl;
    }

    //다른 메서드들도 많이 있음
};

Bicycle bike = new Bicycle('M', "red");
cout << bike.size << endl; //'M'
bike.spares(); // 23 \n 10-speed \n red
```
- Bicycle 인스턴스는 spares, size, tape_color 메시지를 이해할 수 있음
- Mechanic 은 Bicycle 에게 어떤 예비 부품이 필요한지 spares 메시지를 통해 알 수 있음

<br>

- 예시
  - 패스트핏에서 마운틴 자전거 여행도 제공하기 시작했다고 가정
  - 마운틴 자전거와 로드 자전거는 비슷하지만 다른 점이 있음
  - 마운틴 자전거는 비포장 도로를 달리기 위해 만들어진 자전거임
  - 때문에 튼튼한 프레임, 두꺼운 타이어, 일직선 모양 핸들바, 서스펜션이 필요함
  
- 이때 필요한 기능 중 상당 수는 이미 만들어져 있음

### 6.2.2 자전거 종류 추가하기
---
- 마운틴 자전거에 필요한 대부분의 행동을 이미 구현해 놓은 구체 클래스가 있음
- 아래는 기존의 Bicycle class를 수정하여 로드 자전거 / 마운틴 자전거 모두에 적용될 수 있도록 한 코드
```cpp
class Bicycle
{
private:
    string size;
    string tape_color;
    string style;
    string front_shock;
    string rear_shock;

public:
    Bicycle(string size, string tape_color)
    :size(size),
     tape_color(tape_color)
    {
    }

    Bicycle(string size, string style, string front_shock, string rear_shock)
    :size(size),
     style(style),
     front_shock(front_shock),
     rear_shock(rear_shock)
    {   
    }

    //style을 체크하면서 안 좋은 길로 들어선다
    void spares()
    {
        string chain;
        string tape_color;
        string rear_shock;
        double tire_size;
        switch(style)
        {
            case "road":
            {
                chain = "10-speed";
                tire_size = 23;
                tape_color = tape_color;
                cout << tire_size << endl;
                cout << chain << endl;
                cout << tape_color << endl;
                break;
            }
            default:
            {
                chain = "10-speed";
                tire_size = 2.1
                rear_shock = rear_shock;
                cout << tire_size << endl;
                cout << chain << endl;
                cout << rear_shock << endl;
                break;
            }
        }
        
    }

    //다른 메서드들도 많이 있음
};

Bicycle bike = new Bicycle("S", "mountain", "Manitou", "Fox");
cout << bike.size << endl; //'M'
bike.spares(); // 2.1 \n 10-speed \n Fox
```
- 위 코드는 style 변수가 가지고 있는 값을 확인하고 어떤 예비부품이 필요한지 결정함
- 이런 방식의 구성은 여러가지 안 좋은 결과를 낳음
  - 새로운 style을 추가할 경우 switch 문 수정이 필요함
  - switch 마지막 옵션이 default의 경우 잘 못 된 style 이 입력되더라도 동작하는 문제가 있음
  - spares 메서드는 기본 문자열을 가지고 있는데, switch문에서 중복이 발생함
- Bicycle은 spares, size 그리고 그 외 여러 부품의 이름으로 만든 public interface를 제공함
<br>

- 위 코드느 자기가 어떤 종류인지 알고 있는 어트리뷰트를 확인하는 switch문을 포함함
- 이를 통해 자기 자신에게 어떤 메시지를 보낼지 결정함
- 객체의 클래스를 자기가 어떤 종류인지 알고 있는 어트리뷰트의 특수한 경우라 생각할 수 있음
- 위는 "나는 네가 누구인지 알고 있다. 때문에 네가 무엇을 하는지도 안다" 라는 지식이며, 수정비용을 높이는 의존성임

### 6.2.3 숨겨진 타입 찾아내기
---
- style 은 Bicycle 을 서로 다른 두 종류로 구분하고 있음, 하나의 클래스가 여러 개의 서로 다른, 하지만 연관된 타입을 가지고 있음

### 6.2.4 상속을 선택하기
---
- 상속은 두 객체 사이의 관계를 정의
  - 첫 번쨰 객체가 이해할 수 없는 메시지를 수신하면 이 객체는 다음 객체에게 자동으로 메시지를 전달 또는 위임
  - 두 객체가 이와 같은 관계를 맺도록 정의해줌
  - 다중 상속이 가능함 ( 두 개 이상의 부모클래스를 가질 수 있음 )
  - 여러 객체지향 언어들은 다중상속의 복잡함을 피하기 위해 단일상속을 지원함

### 6.2.5 상속 관계 그리기
---

## 6.3 상속의 잘못된 사용
---
- 아래 코드는 하위클래스 MountainBike 를 만들어 보려는 첫 번째 시도임 ( 잘못된 시도 )
```ruby
class MountainBike < Bicycle
  attr_reader : front_shock, :rear_shock

  def initialize(args)
    @front_shock = args[:front_shock]
    @rear_shock = args[:rear_shock]
    super(args)
  end

  def spares
    super.merge(rear_shock: rear_shock)
  end
end

mountain_bike = MountainBike.new(
  size: 'S',
  front_shock: 'Manitou',
  rear_shock: 'Fox'
)

mountain_bike.size # -> 'S'

mountain_bike.spares
# -> {:tire_size => "23"  <- 틀렸음
#     :chain => "10-speed",
#     :tape_color => nil, <- 해당사항 없음
#     :front_shock => 'Manitou'
#     :rear_shock => 'Fox'}
```
- MountainBike의 인스턴스가 로드 자전거와 마운틴 자전거의 행동으로 뒤죽박죽으로 가지고 있음
- 위와 같이 코드가 배치될 때, MountainBike는 자신이 원하지 않고 필요하지 않는 행동을 상속받음

## 6.4 추상화 찾아내기
---
- 하위클래스는 상위클래스의 특수한 형태(specialization)임
- MountainBike는 Bicycle의 모든 행동을 갖고 있고 추가적인 행동을 더 가지고 있어야함
- Bicycle과 협업할 수 있는 모든 객체는 MountainBike에 대해 아무것도 모른 채 MountainBike와 협업할 수 있어야함

### 6.4.1 추상화된 상위클래스 만들기
---
- Bicycle을 상위 클래스를 가지는 하위클래스 MountainBike / RoadBike 를 가져야 하는 구조로 변경되어야 함
- 이때 Bicycle은 추상 클래스가 됨
```ruby
class Bicycle
  # 이 클래스에는 아무 내용이 없다.
  # 기존에 있던 코드는 모두 RoadBike로 옮겼다.
  # 기존에 Bicycle을 RoadBike를 구상하고 만든 것이기 때문임
end

class RoadBike < Bicycle
  # 이제 Bicyclle의 하위클래스가 되었다.
  # 기존의 Bicycle 클래스가 가지고 있던 모든 코드를 갖고 있다.
end 

class MountainBike < Bicycle
  # 여전히 Bicycle의 하위클래스이다. ( 비어있지 않음 )
  # 코드가 수정되지 않음
end 
```
- 새로 만든 RoadBike 클래스는 Bicycle의 하위클래스임
- 위와 같이 코드를 재배치하는 것은 단순히 문제의 지점을 옮기는 것에 불과함
- 위와 같이 수정했을 때, MountainBike는 제대로 동작하지 않을 수 있음

```ruby
road_bike - RoadBike.new(
  size: 'M',
  tape_color: 'red'
)

road_bike.size # => 'M'

mountain_bike = MountainBike.new(
  size: 'S',
  front_shock: 'Manitou',
  rear_shock: 'Fox'
)
mountain_bike.size
#NoMethodError : undefined method 'size'
```

### 6.4.2 추상적인 행동을 위로 올리기
---
```ruby
class Bicycle
  attr_reader :size # <- RoadBike에서 가지고옴
  
  def initialize(args={})
    @size = args[:size] # <- RoadBike에서 가지고옴
  end
end

class RoadBike < Bicycle
  attr_reader :tape_color

  def initialize(args)
    @tape_color = args[:tape_color]
    super(args) # <- 이제 RoadBike는 super를 전송해야함
  end

  #...
end
```
- RoadBike는 size 메서드를 Bicycle로부터 상속받고 있음
- RoadBike는 Bicycle의 하위클래스이기 때문에 이 메시지 전달은 자동으로 이루어짐
- RoadBike는 size에 제대로 반응할 수 있었지만 MountainBike는 그러지 못했음

```ruby
road_bike = RoadBike.new(
  size: 'M',
  tape_color: 'red'
)

road_bike.size # -> 'M'

mountain_bike = MountainBike.new(
  size: 'S'
  front_shock: 'Manitou',
  rear_shock: 'Fox'
)

mountain_bike.size # -> 'S'
```

### 6.4.3 구체적인 것들 속에서 추상적인 것 분리해내기
---
- 아래의 요구사항을 따를 수 있어야 함
  - Bicycle은 체인(chain)과 타이어 크기(tire size)를 가짐
  - 모든 자전거는 chain의 기본값을 공유하고 있음
  - 하위클래스는 자신만의 타이어 크기(tire size) 기본값을 가짐
  - 하위클래스의 구체적인 인스턴스는 기본값을 무시하고 인스턴스 고유의 값을 설정할 수 있음

```ruby
class Bicycle
  attr_reader:size, :chain, :tire_size

  def initialize(args={})
    @size = args[:size]
    @chain = args[:chain]
    @tire_size = args[:tire_size]
  end 
  #...
end
```
- RoadBike와 MountainBike는 Bicycle의 attr_reader 정의를 상속받고 있고 둘 모두 initialze에서 super를 전송함

### 6.4.4 탬플릿 메서드 패턴 사용하기
---
- 기본 구조를 상위 클래스가 정의하고 상위클래스에서 메시지를 전송하여 하위클래스의 특수한 값을 얻는 기술을 템플릿 메서드 패턴이라 부름

```ruby
class Bicycle
  attr_reader :size, :chain, :tire_size

  def Initialize(args)
    @size = args[:size]
    @chain = args[:chain] || default_chain
    @tire_size = args[:tire_size] || default_tire_size
  end

  def default_chain
    '10-speed'
  end
end

class RoadBike < Bicycle
  #...
  def default_tire_size
    '23'
  end
end

class MountainBike < Bicycle
  #...
  def default_tire_size
    '2.1'
  end
end
```
- 이제 Bicycle은 그 하위클래스에게 구조를 제공함 또는 공통의 알고리즘이라고 말해도 좋음

```ruby
road_bike = RoadBike.new(
  size: 'M'
  tape_color: 'red'
)

road_bike.tire_size #-> '23'
road_bike.chain #-> '10-speed'

mountain_bike = MountainBike.new(
  size: 'S',
  front_shock: 'Manitou',
  rear_shock: 'Fox'
)

mountain_bike.tire_size # -> '2.1'
road_bike.chain # -> '10-speed'
```

### 6.4.5 모든 탬플릿 메서드 구현하기
---
- Bicycle의 initialize 메서드는 default_tire_size 메서드를 전송하지만 스스로 구현하고 있지 않음
- 이후 RecumbenBike를 만들고, RecumbentBike 메서드에서 default_tire_size를 구현하지 않았을 경우, 오류를 발생시킴
- 위와 같은 경우에서 처음 작성한 사람은 알아채기 힘듬
- default_tire_size 와 같은 필수 구현 요소를 명시적으로 구현해야 한다고 말해주는 것은 그 자체로 훌륭한 문서임

## 6.5 상위클래스와 하위클래스 사이의 커플링 관리하기
---

### 6.5.1 커플링 이해하기
---
```ruby
class Bicycle
  attr_reader :size, :chain, :tire_size

  def initialize(args={})
    @size = args[:size]
    @chain = args[:chain] || default_chain
    @tire_size = args[:tire_size] || default_tire_size
  end

  def spares
    {tire_size: tire_size,
    chain: chain}
  end

  def default_chain
    '10-speed'
  end

  def default_tire_size
    raise NotImplementedError, "This #{self.class} cannot respond to;"
  end
end

class RoadBike < Bicycle
  attr_reader : tape_color
  
  def initialize(args)
    @tape_color = args[:tape_color]
    super(args)
  end

  def spares
    super.merge({ tape_color: tape_color})
  end

  def default_tire_size
    '23'
  end
end

class MountainBike < Bicycle
  attr_reader :front_shock, :rear_shock

  def initialize(args)
    @front_shock = args[:front_shock]
    @rear_shock = args[:rear_shock]
    super(args)
  end

  def spares
    super.merge({rear_shock: rear_shock})
  end

  def default_tire_size
    '2.1'
  end
end
```
- Bicycle이 전송하는 모든 템플릿 메서드는 Bicycle 내에서 구현되어 있음
- MountainBike / RoadBike 모두 initialize와 spares 메서드에서 super를 전송함
- 위 코드에서 상속관계느 잘 작동함
- 다른 클래스에 대해 알고 있다면 여기서 의존성이 만들어짐
- 하위클래스가 super를 전송한다는 것은 스스로 알고리즘에 대해 알고 있다고 말하는 것임, 즉 이 지식에 의존하고 있다는 것임

### 6.5.2 훅 메시지를 사용해서 하위클래스의 결합 없애기
---
```ruby
class Bicycle
  attr_reader :size, :chain, :tire_size

  def initialize(args={})
    @size = args[:size]
    @chain = args[:chain] || default_chain
    @tire_size = args[:tire_size] || default_tire_size
    post_initialize(args)
  end

  def spares
    {tire_size: tire_size,
    chain: chain}.merge(local_spares)
  end

  def default_tire_Size
    raise NotImplementedError
  end

  #하위클래스가 재정의 할 수 있다
  def post_initialize(args)
    nil
  end

  def local_spares
    {}
  end

  def default_chain
    '10-speed'
  end
end

class RoadBike < Bicycle
  attr_reader :tape_color

  def Post_initialize(args)
    @tape_color = args[:tape_color]
  end

  def local_spares
    {tape_color: tape_color}
  end

  def default_tire_size
    '23'
  end
end

class MountainBike < Bicycle
  attr_reader :front_shock, :rear_shock

  def post_initialie(args)
    @front_shock = args[:front_shock]
    @rear_shock = args[:rear_shock]
  end

  def local_spares
    {rear_shock: rear_shock}
  end

  def default_tire_size
    '2.1'
  end
end
```
- 하위클래스가 알고리즘을 알고 있고 super를 전송하는 대신 훅(hook) 메시지를 전송할 수 있음
- 훅(hook) 메시지는 정해진 메서드 구현을 통해 하위클래스가 정보를 제공할 수 있도록 만들어주는 메시지임
- 훅(hook)을 사용하면 하위클래스는 알고리즘에 대해 몰라도 되며, 상위클래스가 모든 권핞을 가질 수 있게 됨