# 5장 오리 타입으로 비용 줄이기
- 오리 타입은 특정 클래스에 종속되지 않은 퍼블릭 인터페이스임

## 5.1 오리 타입 이해하기
- Mechanic 클래스의 인스턴스는 Mechanic의 퍼블릭 인터페이스르 전부 가지고 있음, Mechanic의 인스턴스를 사용하는 객체는 이 인스턴스 자체가 Mechanic인 것처럼 취급할 수 있음
- 유연성을 현명하게 사용하기 위해서는 클래스를 가로지르는 타입 ( acrossclass types ) 를 알아 볼 수 있어야 함

### 5.1.1 오리 타입 무시하기
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

### 5.1.4 오리 타입을 사용해서 얻을 수 있는 이점

## 5.2 오리 타입을 사용하는 코드 작성하기

### 5.2.1 숨겨진 오리 타입 알아보기

### 5.2.2 오리 타입을 믿기

### 5.2.3 오리 타입 문서 작성하기

### 5.2.4 오리 타입끼리 코드 공유하기

### 5.2.5 현명하게 오리 타입 선택하기

## 5.3 오리 타입을 무서우하기 않고 사용하기

### 5.3.1 정적 타입으로 오리 타입 거부하기

### 5.3.2 정적 타입 vs 동적 타입

### 5.3.3 동적 타입 받아들이기

