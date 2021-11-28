# 데코레이터 ( Decorator )
## 데코레이터 란?
- 주어진 상황 및 용도에 따라 어떤 객체에 책임을 덧붙이는 패턴
- 객체에 추가적인 요건을 동적으로 첨가하여, 기능 확장이 필요할 때 서브크래싱 대신 쓸 수 있는 유연한 대안

## UML
![img.png](../../../assets/Decorator.png)
- Component : ConcreteComponent 과 Decorator 가 구현할 인터페이스
- ConcreteComponent : 기능 추가를 받을 기본 객체
- Decorator : 기능 추가를 할 객체는 이 객체를 상속 받음
- ConcreteDecorator : Decorator 를 상속받아 구현할 다양한 기능 개체, 이 기능들은 ConcreteComponent 에 추가되기 위해 만들어 짐

## 데코레이터 장/단점
### 장점
- 객체에 동적으로 기능 추가가 간단하게 가능

### 단점
- 자질한 데코레이터 클래스들이 계속 추가되어 클래스가 많아질 수 있음
- 겹겹이 애워싸고 있기 때문에 객체의 정체를 알기 힘들고 복잡해질 수 있음

## Example Code
```cpp
class Component
{
public:
    virtual void operation() = 0;
};

class ConcreteComponent : public Component
{
public:
    void operation()
    {
        cout << "ConcreteComponent" << endl;
    }
};

class Decorator : public Component
{
public:
    Decorator(Component* c) 
    : pComponent(c)
    {
    }

    ~Decorator()
    {
        if ( NULL != pComponent )
        {
            delete pComponent;
        }
    }
public:
    void operation()
    {
        if ( NULL != pComponent)
        {
            pComponent->operator();
        }
    }
};

class ConcreteDecorator : public Decorator
{
public:
    ConcreteDecorator(Component *d)
    :Decorator(d)
    {
    }

    void operation()
    {
        Decorator::operation();
        cout << "ConcreteDecorator" << endl;
    }
}

Component *pComponent = new ConcreteDecorator(new ConcreteDecorator(new ConcreteComponent()));
pComponent->operation();
delete pComponent;
```

## 참고자료
[무니 Blog](https://devmoony.tistory.com/78)

[DailyHeumsi Blog](https://dailyheumsi.tistory.com/198)

