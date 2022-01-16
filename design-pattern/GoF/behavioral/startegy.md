# 스트래티지 ( startegy )
## 스트래티지 란?
---
- 스트래티지 패턴은 각각을 캡슐화하여 교환해서 사용할 수 있도록 만듦
- 알고리즘을 사용하는 클라이언트와는 독립적으로 알고리즘을 변경할 수 있음
- 즉, 행위를 클래스로 캡슐화하여 동적으로 행위를 바꾸어도 코드가 복잡해 지지 않도록 하는 패턴

## UML
---
![img.png](../../../assets/stragety.png)
![img2.png](../../../assets/stragety_2.png)

- Context : 외부에서 동일한 방식으로 알고리즘을 호출할 수 있도록 명시해둔 인터페이스
- Strategy : 스트래티지 인터페이스에서 명시해둔 코드를 실제로 구현한 클래스
- ConcreteStrategy : 스트래티지 패턴을 이용하는 역할을 수행하는 추상 클래스, 필요에 따라 동적으로 구체적인 전략을 바꿀 수 있도록 하기 위해 setter 메서드를 제공
- note: setter 메서드는 Context에서 구현해서 사용하는 메서드로 보임

## 스트래티지 장/단점
### 장점
---
- 런타임에 개체 내부에서 사용되는 알고리즘을 교환할 수 있음
- 알고리즘을 사용하는 코드에서 구현 정보를 분리 가능
- 상속을 구성으로 대체할 수 있음 ( 조합느낌 )

### 단점
---
- 거의 변경되지 않는 알고리즘 혹은 알고리즘이 몇개 안된다면 굳이 필요없음
- 클라이언트가 ConcreteStrategy 간의 차이를 알고 있어야 적절한 알고리즘을 선택할 수 있음

## Example Code
---
```cpp
class Strategy;

class Context
{
public:
    TestBed()
        :myStrategy(nullptr);
    {
    }

    void setStrategy(const Strategy strategy)
    {
        myStrategy = strategy;
    }
private:
    Strategy* myStrategy;
};

//strategy
class Strategy
{
public:
    void executeBehavior()
    {
        execute();
    }
private:
    virtual execute();
};

//ConcreteStrategy
class behaviorOne : public Strategy
{
private:
    void execute()
    {
        cout << "behaviorOne\n";
    }
};

class behaviorTwo : public Strategy
{
private:
    void execute()
    {
        cout << "behaviorTwo\n";
    }
};

class behaviorThree : public Strategy
{
private:
    void execute()
    {
        cout << "behaviorThree\n";
    }
};

typedef int eStrategy;
static eStrategy behaviorOne = 1;
static eStrategy behavioeTwo = 2;
static eStrategy behaviorThree = 3;

void selectedStrategy(Context& context, const eStrategy choiceStrategy)
{
    Strategy strategy;
    switch(choiceStrategy)
    {
        case behaviorOne:
        {
            strategy = new behaviorOne();
            break;
        }
        case behaviorTwo:
        {
            strategy = new behaviorTwo();
            break;
        }
        case behaviorThree:
        {
            strategy = new behaviorThree();
            break;
        }
        default:
        {
            strategy = new behaviorOne();
            break;
        }
    }

    context.setStrategy(strategy);
}

Context context;

selectedStrategy(context, behaviorOne);

context.myStrategy->executeBehavior();

```

## 참고자료
---
[Crocus Blog](https://www.crocus.co.kr/1526)

[Regactoring-guru](https://refactoring.guru/design-patterns/strategy)
