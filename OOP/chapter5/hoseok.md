# 5장 오리 타입으로 비용 줄이기
---
- 오리 타입은 특정 클래스에 종속되지 않은 퍼블릭 인터페이스임

## 5.1 오리 타입 이해하기
---
- Mechanic 클래스의 인스턴스는 Mechanic의 퍼블릭 인터페이스르 전부 가지고 있음, Mechanic의 인스턴스를 사용하는 객체는 이 인스턴스 자체가 Mechanic인 것처럼 취급할 수 있음
- 유연성을 현명하게 사용하기 위해서는 클래스를 가로지르는 타입 ( acrossclass types ) 를 알아 볼 수 있어야 함

### 5.1.1 오리 타입 무시하기
---
- 아래 코드에서 Trip의 prepare 메서드느 자신이 인자로 받은 mechanic 객체에게 prepare_bicycles 메시지를 전송
```cpp
class Trip
{
private:
    vector<string> bicycle;
    vector<string> customers;
    string vehicle;

public: 
    //무엇이든 이 'mechanic' 인자의 클래스가 될 수 있음
    template <typename T>
    void prepare(T mechanic)
    {
        mechanic.prepare_bicycles(bicycle);
    }
}

class Mechanic
{
public:
    void prepare_bicycles(vector<string> bicycles)
    {
        for(int idx = 0; idx < bicycles.size(); idx)
        {
            prepar_bicycle(bicycles[idx]);
        }
    }

    void prepare_bicycle(string bicycle)
    {
        //...
    }
}
```
- 사진 첨부
- Trip의 prepare 메서드 자체는 Mechanic 클래스에 의존하고 있지 않음
- prepare_bicycles 메서드에 반응할 수 있는 객체를 수신해야 한다는 사실에 의존하고 있음

### 5.1.2 문제가 더 복잡해지면
- 여행 준비에 mechanic말고 trip coordinator와 driver도 필요해짐

```cpp
class Trip
{
private:
    vector<string> bicycles;
    vector<string> customers;
    string vehicle;

public:
    void prepare(map<string, Person> prepares)
    {
        for(int idx = 0; idx < prepares.size(); idx++)
        {
            switch(prepares[idx].first)
            {
            case "Mechanic":
                prepares[idx].prepare_bicycles(bicycles);
                break;
            case "TripCoordinator":
                prepares[idx].buy_food(customers);
                break;
            case "Driver":
                prepares[idx].gas_up(vehicle);
                prepares[idx].fill_water_tank(vehicle);
                break;
            }
        }
    }
};

class Person
{
    //...
}

class TripCoordinator : public Person
{
public:
    void buy_food(vector<string> customers)
    {
        //...
    }
};

class Driver : public Person
{
public:
    void gas_up(string vehicle)
    {
        //...
    }

    void fill_water_tank(string vehicle)
    {
        //...
    }
};
```
- 프로그래머가 애플리케이션에 어떤 클래스가 있는지 잘 모르고 중요한 메시지를 파악하지 못 했을 경우에 위와 같은 코드가 나옴
- 위와같이 의존성이 겹겹이 쌓여 있는 코드는 클래스 기반 관점이 자연스럽게 발전한 모양새임

- 인자들이 모두 다른 클래스의 인스턴스이고 서로 다른 메서드를 구현하고 있음
- 인자의 클래스를 알아야 어떤 메시지를 전송할지 알 수 있음
- 더 심각한 것은 여행을 준비하는 또 다른 준비객체(prepares)가 필요해 진다면, 수많은 클래스 이름을 알고 있고 클래스에 꼭 맞는 메시지를 전송할 줄 아는 메서드, 애플리케이션에는 이런 메서드가 쌓여갈 것임
  
 > 뻣뻣하고 유연하지 못한 애플리케이션임

- 사진 첨부

### 5.1.3 오리 타입 찾기
---
- Trip 의 prepare 메서드는 하나의 목적을 갖고 있기 때문에 prepare의 인자 역시 이 목표를 이루기 위해 협업하는 객체임
- '인자의 클래스가 무엇을 할 줄 아는지' 이미 알기 때문에 자꾸 옆길로 샘
 > 'prepare가 뭉서을 원하는지'에 집중하는 것이 필요


- 그림 5.2 ( page. 104 )
- 위 그림에서 prepare 메서드는 인자의 클래스에게 아무것도 기대하지 않음
 > 이 인자가 '여행을 준비하는 객체 ( preparer )' 이기만을 바람
- Mechanic, TripCoordinator, Driver 는 모두 preparer 처럼 행동해야 하며, prepare_trip을 구현하고 있어야 함
```cpp
class Trip
{
public:
    void prepare(vector<Preparer> preparers)
    {
        vector<Preparer>::iterator iter = preparers.begin();
        for(; iter != preparers.end(); iter++)
        {
            iter->prepare_trip(this);
        }
    }

private:
    vector<string> bicycles;
    vector<string> customers;
    string vehicle;
};

class Preparer
{
public:
    virtual void prepare_trip(Trip trip) = 0;
};

// 모든 preparer가 오리 타입일 떄, 이 객체들은 모두 prepare_trip 메서드를 이해함
class Mechnic : public Preparer
{
public:
    void prepare_trip(Trip trip)
    {
        unsigned int32_t size = trip.bicycles.size();
        for(unsigned int32_t idx = 0; idx < size; idx++)
        {
            prepare_bicycle(trip.bicycles[idx]);
        }
    }
};

class TripCoordinator : public Preparer
{
public:
    void prepare_trip(Trip trip)
    {
        buy_food(trip.customers);
    }
};

class Driver : public Preparer
{
public:
    void prepare_trip(Trip trip)
    {
        vehicle = trip.vehicle;
        gas_up(vehicle);
        fill_water_tank(vehicle);
    }
};
```

### 5.1.4 오리 타입을 사용해서 얻을 수 있는 이점
---
- 위 코드에는 나름의 대칭성이 있으며, 이는 우리가 제대로 된 디자인을 구현했다는 것을 보여주는 기분 좋은 대칭임
- 위 코드는 추상적이라 좀 더 노력해야 하지만, 손쉬운 확장성을 제공함
- 객체지향 디자인은 구체적인 코드를 작성하는 비용, 추상적인 코드를 작성하는 비용 사이의 긴장에서 결코 자유로울 수 없음
 > 구체적이면 이해하기 쉽지만 확장비용이 높고, 추상적이면 이해하기 어렵지만 확장비용이 낮음

#### 폴리모피즘
---
- 일반적인 정의
  - 'Morph 는 형태를 뜻하는 그리스어, morphism 은 형태를 가지고 있는 상태를 뜻하며 polymorphism 은 여러 형태를 가지고 있는 상태를 의미
- 객체지향 프로그래밍에서 정의
  - 같은 메시지에 반응할 수 있는 여러 객체의 능력을 의미함
  - 메시지의 송신자는 숮신자의 클래스를 신경 쓸 필요 없고, 수신자는 주어진 행동에 걸맞는 자신만의 행동을 제공

## 5.2 오리 타입을 사용하는 코드 작성하기
---
- 오리 타입을 사용하려면 클래스를 가로지르는 인터페이스 ( acorss-class interface )를 사용하면 좋은 지점을 찾아내는 아목부터 갖춰야 함
 > 오리 타입이 필요하는 사실을 인지하고 인터페이스를 추사오하시키는 부분이 중요함

### 5.2.1 숨겨진 오리 타입 알아보기
---
#### a. 클래스에 따라 변경되는 case 구분
- 위 예시, 즉 도메인 객체의 클래스 이름에 따라 다르게 작동하는 case 구분
```cpp
class Trip
{
public:
    void prepare(map<string, Person> prepares)
    {
        for(int idx = 0; idx < prepares.size(); idx++)
        {
            switch(prepares[idx].first)
            {
            case "Mechanic":
                prepares[idx].prepare_bicycles(bicycles);
                break;
            case "TripCoordinator":
                prepares[idx].buy_food(customers);
                break;
            case "Driver":
                prepares[idx].gas_up(vehicle);
                prepares[idx].fill_water_tank(vehicle);
                break;
            }
        }
    }

private:
    vector<string> bicycles;
    vector<string> customers;
    string vehicle;
};
```
- 위 패턴은 모든 Preparer 가 무언가를 공유하고 있다는 사실을 바로 알려줌

#### b. kind_of? 와 is_a?
---
- 루비 언어가 가지는 특징으로 확인됨
- cpp 에서 확인할 수 없는 것으로 보임

#### c. responds_to?
---
- responds_to : type을 확인하는 메서드로 보임
- cpp 에서 function 에 대한 타입을 확인할 수 있는 것은 없는것으로 보임

### 5.2.2 오리 타입을 믿기
---
- 위 모든 경우 코드는 아래오 ㅏ같이 말하고 있음
- '나는 네가 누구인지 알고 있고, 그렇기 때문에 네가 무엇을 하는지도 알 고 있다'
- 위 스타일의 코드는 어떤 객체 하나를 놓치고 있다는 사실을 말해주며, 이는 아직 public 인터페이스를 발구해내지 못한 어떤 객체가 있다는 뜻이기도 함
- 유연한 애플리케이션이란, 믿을 수 있는 객체로 이루어져 있고, 객체를 믿을 만하게 만드는 일은 우리 ( 개발자 ) 의 몫임

### 5.2.3 오리 타입 문서 작성하기
---
- 가장 단순한 형태의 오리 타입은 퍼블릭 인터페이스에 대한 합의만으로 존재함
- perpare_trip 을 여러 클래스가 구현하고 있고, 덕분에 클래스를 Perparer 처럼 취급할 수 있음

- Preparer는 추상적이기에 매우 강력한 디자인 도구가 될 수 있지만, 이 추상성 자체가 코드 속에서 오리 타입을 잘 드러나지 않게 만듦
- 오리 타입을 만들었다면 문서도 작성하고 오리 타입의 퍼블릭 인터페이스 역시 테스트해야함

### 5.2.5 현명하게 오리 타입 선택하기
---
- 안정성이 높다면 'kind_of?', 'is_a?', 'responds_to?' 를 사용해도 문제가 생길 가능성이 낮다는 얘기를 하는 것으로 보임
- 예를 들어 기본 타입 ( int, double ... ) 과 같은 type을 비교할 때

## 5.3 오리 타입을 무서워하기 않고 사용하기
---

### 5.3.1 정적 타입으로 오리 타입 거부하기
---
- 대부분의 정적 타입 언어는 변수와 메서드 파라미터의 타입을 명시적으로 선언할 것을 요구하고, 동적 타입 언어에서는 일너 선언을 생략할 수 있음 ( 모두 그런 것은 아님 )
- 정적 타입 언어는 새로운 클래스가 등장할 때마다 타입 에러를 발생시킬 수 있고, 이때마다 새로운 타입을 확인하는 코드 추가가 필요한 악순환이 반복될 수 있음
- 오리 타입의 사용은 위와같은 함정에서 빠져나올 수 있는 방법을 제시할 뿐 아니라, 클래스에 대한 의존성을 제거하면 타입 실패 역시 제거가 되며, 코드가 안정적으로 의존할 수 있는 추상화를 드러내줌

### 5.3.2 정적 타입 vs 동적 타입
---
- 정적 타입의 이점
  - 컴파일 시점에서 컴파일러가 타입 에러를 잡아낼 수 있다.
  - 눈에 보이는 타입 정보가 문서의 역할을 한다.
  - 컴파일된 코드는 빠르게 동작할 수 있도록 최적화되어 있다.

- 위 이점은 각각에 상응하는 가정을 받아들일 경우에만 의미가 있음
  - 컴파일러가 타입을 확인하지 않으면 런타임 타입 에러가 발생
  - 프로그래머는 전체 맥락에서 객체의 타입을 추측할 수 없고, 코드를 이해하지 못할 것
  - 이러한 최적화를 거치지 않으면 애플리케이션이 너무 느릴 것

- 동적 타입의 이점
  - 코드가 해석되면 ( interpreted ) 동적으로 로드 ( load ) 될 수 있다.
  - compile / make 과정을 거칠 필요가 없다.
  - 소스 코드에 명시적인 타입 정보를 포함할 필요가 없다.
  - 메타프로그래밍이 쉽다.

- 아래 가정을 받아들인다면 위 이점은 보다 강화될 것임
  - compile / make 과정이 없다면 전체 애플리케이션 개발이 보다 빠르게 진행된다.
  - 타입을 선언하는 코드가 없으면 프로그래머가 코드를 이해하기 쉽다.
  - 맥락 속에서 객체의 타입을 추측할 수 있다.
  - 메타프로그래밍은 프로그래밍 언어의 바람직한 기능이다.

### 5.3.3 동적 타입 받아들이기
---
- 특정 애플리케이션의 경우, 정적 타입 코드가 동적 타입 구현보다 훨씬 나은 결과를 가져올 수 있음
<br>
 > 어떻게 정리해야할 지 모르겠음
 > 동적 타입 언어에 대한 이점(?)을 설명하고 있는 것으로 보임
 > c++은 정적 타입의 언어라 정리가 필요한 내용인지 모르겠음
