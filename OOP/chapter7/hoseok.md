# 7장 모듈을 통한 역할 공유
---
- '패스트릿이 리컴벤트 마운틴 자전거를 필요로 하면 어떻게 할까'라는 고민이 필요함

## 7.1 역할 이해하기
---
- 공통의 행동은 클래스와 아무런 상관이 없음
- 이 행동은 객체가 수행하는 역할(role)임
- 의존성은 우리가 어떤 디자인을 선택할지 고민할 때 꼭 고려해야 하는 것들임

### 7.1.1 역할 찾기
---
- preparer 역할이 있다는 사실은 그 맞짝인 preparable 역할이 있다는 점을 말해줌 ( 역할은 종종 맞짝을 이루어서 등장 )
- 인터페이스는 preparer가 preparable에게 전송할 모든 메시지를 포함하고 있음
- 메시지 : bicycle, customers, vehicle / preparable 역할을 수행하는 객체 : Trip
- preparable 역할을 수행하는 객체는 Trip뿐이기때문에 역할은 명백하게 드러나지 ㅇ낳음
- preparer 역할을 수행하는 수행자는 여럿이지만 이 역할은 단순해서 인터페이스를 통해 모두 정의되어 있음
- preparer처럼 행동하려면 이 인터페이스만 공유하면 됨
- 메서드 시그니처 ( method signature ) 를 공유할 뿐 코드를 공유하지 않음
- preparer / preparable 는 머리부터 발끝까지 오리 타입임
- 메서드 시그니처만 공유하는 것이 아니라 특정 행동까지 공유해야 하는 역할이 있음
- 이런 상황에서 역할 수행자들이 행동을 공유해야 할 경우에는 공통의 코드를 어떻게 정리할지 고민해야 함
- 메서드는 모듈 속에서 정의되고 어느 객체든 이 모듈을 추가할 수 있음
- 모듈은 서로 다른 클래스에 속한 객체가 한 덩어리의 코드를 이용해서 같은 역할을 수행하는 최고의 방법을 제공함
- 객체가 모듈을 추가하면 이 객체가 반응할 수 있는 메시지의 수를 확장한 것이 됨
- 객체는 다음에서 설명하는 내용에 부합하는 모든 메시지에 반응할 수 있음
  - 스스로 구현하고 있는 메시지
  - 상속 관계에서 자기보다 상위에 있는 모든 객체가 구현하고 있는 메시지
  - 자기가 인클루드한 모든 모듈이 구현하고 있는 메시지
  - 상속 고나계에서 자기보다 상위에 있는 모든 객체가 인클루드하고 있는 모든 모듈이 구현하고 있는 메시지

### 7.1.2 책임 관리하기
---
- 고전적 상속에서도 그랬던 것처럼 로이 타입을 사용하고 공통된 행동을 모듈에 넣으려 들기 전에 어떻게 하면 제대로 작업할 수 있는지를 먼저 알아야 함
- 여행 스케줄을 짤 때 발생할 수 있는 문제
  - 여행은 일정한 시간 동안 진행되고 자전거, 정비공, 자동차가 필요
  - 자전거, 정비공, 장도차는 현실 세계에 존재하기 때문에 같은 시간에 두 장소에 존재할 수 없음
  - 패스트핏은 이 모든 것의 스케줄을 관리하고 있어야만 언제 어느 순간에 어떤 것을 사용할 수 있고 어떤 것을 사용하고 없는지 알 수 있음
  - 여행에 당장 동원할 수 있는 정비공이 있는지 확인이 필요
  - 정비공의 스케줄을 관리해야 함 ( 다양한 스케줄이 있음 )
  - 자전거는 여행과 여행 사이에 최소 하루 정도 정비할 시간이 필요하고 자동차는 사흘 정비공은 나흘 정도 쉬어야 함
-  위 객체들의 스케줄을 관리하는 코드는 여러 가지 방법으로 작성할 수 있음

<br>

- Schedule 클래스가 있다고 가정

```ruby
scheduled?(target, starting, ending)
add(target, starting, ending)
remove(target, starting, ending)
```
- target : 확인하려는 대상
- starting, ending : 관심 있는 기간의 시작일과 종료일
- schedule : 인자로 받은 target이 정해진 기간 동안 어떤 일정을 소화해야 하는지 알고 있어야 하며, target을 전체 일정에 추가하거나 제거하는 작업도 책임져야 함
- 고려하지 않은 사항 : 다른 일정을 잡아도 괜찮은지 제대로 알기 위해서는 여행을 시작하기 전에 필요한 준비시간을 고려해야 함
- schedulable? 메서드는 필요한 모든 준비시간을 알고 있고 target 인자의 클래스를 확인해서 각 객체에 준비시간을 얼마나 할당해야 하는지 결정함
- 위 내용을 schedule에 포함된다면 너무 많은 책임을 가짐
- 하여, schedule 이름을 확인하는 대상들, 즉 클래스들이 알고 있어야하는 지식임
- 시퀀스 확인이 필요

### 7.1.3 불필요한 의존성 제거하기
---
#### Schedulable 오리 타입 찾아내기
---
- schdulable? 메서드가 클래스를 확인하는 부분을 제거하고, 대신 인자로 넘겨온 target 들에게 lead_says 메시지를 전송하도록 바뀐 모습을 보여줌
- 시퀀스 확인 필요

### 7.1.4 구체적인 코드 작성하기
---
- 코드가 무엇을 해야 하는지, 그 코드를 어디에서 구현해야하는지 반드시 결정해야 함
```ruby
class Schedule
  def scheduled? ( schedulable, start_date, end_date )
    puts "This #{schedulable.class}" + 
          "is not scheduled\n" +
          " between #{start_date} and #{end_date}"
    false
  end
end

class Bicycle
  attr_reader :schedule, :size, :chain, :tire_size

  #schdule 을 주입하여 defuault 제공
  def initialize ( args={} )
    @schedule = args[:schedule]||Schedule.new
    #...
  end

  #Bicycle의 준비시간을 감안해서, 주어진 기간에
  #bicycle을 사용할 수 있으면 true를 반환
  def schedulable?(start_date, end_date)
    !scheduled?(start_date - lead_days, end_date)
  end

  #schedule의 답변을 반환
  def scheduled?(start_date, end_date)
    schedulw.scheduled?(self, start_date, end_date)
  end

  #bicycle을 사용하기 전에 필요한 준비시간의 days를 반환
  def lead_days
    1
  end
  # ...
end
```
- Schedule이 누구인지, Bicycle 안에서 어떤 일을 하는지 드러나지 않음

### 7.1.5 추상화하기
---
- 아래의 새로운 Schedulable 모듈은 위 Bicycle 클래스에서 공통 행동을 뽑아 추상화한 것
- Schedulable 의 lead_days는 다른 class에서도 사용해야 함 ( 아래 코드에 작성해둠 )

```ruby
module Schedulable
  attr_writer :schedule

  def schedule
    @schedule ||= ::Schedule.new
  end

  def schedulable?(start_date, end_date)
    !scheduled?(start_date - lead_days, end_date)
  end

  def scheduled?(start_date, end_date)
    schedule.scheduled?(self, start_date, end_date)
  end

  #when using this module( include ), could be override this method
  def lead_days
    0
  end
end

class Bicycle
  include Schedule
  
  def lead_days
    1
  end
end

class Vehicle
  include Schedulable

  def lead_days
    3
  end
end

class Mechanic
  include Schedulable

  def lead_days
    4
  end
end
```

### 7.1.6 메서드를 찾아 올라가기
---
#### 아주 단순한 설명
- 메세지를 수신한 클래스부터 최상위 클래스까지 구현되고 있는 클래스를 찾아가는 것

#### 조금 더 정확한 설명
- 클래스뿐만 아니라 include 된 모듈까지 포함하여 구현되고 있는 클래스 혹은 모듈을 찾아가는 것

### 7.1.7 역할의 행동 상속받기
---
  - 다른 모듈을 포함( include )하는 모듈 작성 가능
  - 다른 코듈이 정의하고 있는 메서드를 재정의해 버리는 모듈 작성 가능
  - 길게 늘어선 상속 관계에서 중간 여러 층위의 클래스들에 이 모듈을 인클루드 가능
- 위 기술은 매우 강력함
- 때문에 위험함

## 7.2 상속받을 수 있는 코드 작성하기
---

### 7.2.1 안티패턴 알아채기
---
- 상속을 적용하면 좋을 것 같은 안티패턴
  - type이나 category 같은 이름을 가진 변수가 있고 이 변수를 가지고 self에 어떤 메시지를 전송할지 결정하는 경우
  - 객체의 클래스를 확인하고 어떤 메시지를 전송할지 판단하고 있다면 오리타입을 놓치고 있음

### 7.2.2 추상화된 코드를 모두 사용하기
---
- 추상화된 클래스를 상속받은 모든 하위클래스에게 적용되어야 함
- 즉, 몇몇 하위클래스에게만 적용되는 코드가 상위클래스에 포함되어 있으면 안됨
- 공통으로 사용할만한 추상회된 코드가 없다면 주어진 디자인 이슈의 해결책은 상속이 아님

### 7.2.3 약속을 존중하라
---
- 하위클래스는 자신의 상위클래스를 대체할 수 있는 형태가 되어야함
- 상위클래스가 입력받는 인자와 반환되는 값을 제한하고 있어도 하위클래스는 약속을 깨지 않고도 어느 정도의 자유를 누릴 수 있음

### 7.2.4 템플릿 메서드 패턴 사용하기
---
- 템플릿 메서드 패터은 상속받을 수 있는 코드를 작성하기 위한 가장 핵심적인 기술임
- 템플릿 메서드는 알고리즘의 변경되는 지점들을 표현하고, 이 템플릿 메서드를 만드는 것을 통해 우리는 어떤 내용이 변하는 것이며 어떤 것이 변하지 않는 내용인지 명시적으로 선택하게 됨

### 7.2.5 한발 앞서 클래스 사이의 결합 깨뜨리기
---
- 상속받은 클래스가  super를 전송해야 하는 코드를 작성하지 말 것
- 훅 메서드는 super를 전송해야 하는 문제를 해결해줌

### 7.2.6 상속 관계 ( 상속구조 ) 를 낮게 만들기
---
- 훅 메서드의 한계는 상속 관계의 높이를 낮게 만들어야 하는 많은 이유 중 하나일 뿐임
- 높이가 낮고 좁은 구조는 이해하기 쉬운 구조이며 높이가 높고 넓을 수록 이해하기 어렵고 유지비용이 비쌈