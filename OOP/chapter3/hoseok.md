# 3장 의존성 관리하기

객체는 현실세계에서 일어나는 문제의 성질을 반영하고 객체 사이의 상호작용은 문제의 해결책을 제공한다.

이런 상호작용은 필수적이다.

하나의 객체가 모든 것을 알고 있을 수는 없기에 결국은 다른 객체와 소통하지 않을 수 없다.

각 메시지는 하나의 객체에서 시작되며 특정한 행동을 유발하기 위해 존재한다.

서로 협업하려면 객체는 다른 객체에 대한 지식이 있어야 한다. 하지만 지식은 의존성을 만들어 낸다.

# 3.1 의존성 이해하기

- A 객체를 수정했을 떄 B 객체를 뒤따라 수정해야 한다면, B 객체는 A 객체에 의존하고 있다는 얘기가 됨
- 아래 예에서 Wheel이 변경된다면 어쩔 수 없이 Gear가 변경되어야 함
- 따라서 Gear는 Wheel에 의존성을 가지고 있다는 얘기가 됨

```cpp
class Wheel
{
private:
    int rim;
    int tire;

public:
    Wheel(int rim, double tire)
        :rim(rim),
        tire(tire)
    {
    }

    double diameter()
    {
        return rim + (tire * 2);
    }
}

class Gear
{
private:
    int chainring;
    int cog ;
    int rim;
    double tire;

public:
    Gear(int chain, int cog, int rim, double tire)
        : chainring(chain),
        cog(cog),
        rim(rim),
        tire(tire)
    {
    }

    double gear_inches()
    {
        Wheel wheel(rim, tire);
        return ratioo() * wheel.diameter();
    }
}
```

## 3.1.1 의존성이 있다는 것을 알기
---
- 다른 클래스의 이름 : Gear 가 Wheel이라는 이름의 클래스가 있다는 걸 알고 있음
- 자기 자신을 제외한 다른 객체에게 전송할 메시지의 이름 : Gear는 Wheel의 인스턴스가 diameter라는 메서드를 이해할 수 있다는 것을 알고 있음
- 메시지가 필요로 하는 인자들 : Gear는 Wheel의 생성을 위해 rim, tire를 인자로 넘겨야 한다는 것을 알고 있음
- 인자들을 전달하는 순서 : Gear는 Wheel의 생성자의 첫 번째 인자가 rim, 두 번째 인자가 tire 임을 알고 있음

## 3.1.2 객체들 간의 결합
- 위와 같은 의존성은 Gear를 Wheel 에 결합 (couple) 시킴, 즉 이런 결합이 의존성을 낳는다고 말할 수 있음
- Gear를 사용할 때는 잘 동작하는 것을 알 수 있지만, Gear를 다른 곳에서 사용하거나, Gear가 의존하고 있는 클래스 (예를 들어, Wheel 클래스) 를 수정하려는 순간에 문제가 보임
- 이 떄, Gear 라는 클래스는 독립적인 클래스가 아니라는 것을 알 수 있음
- 둘 이상의 객체가 강력하게 결합되어 있을 때 이들은 한 덩어리로 움직이고 이들 중 하나만 재사용하는 것을 거의 불가능함

## 3.1.3 다른 의존성들
- 하나의 객체가 다른 객체에 대해 알고 있는데 이 다른 객체가 무언가를 알고 있는 또 다른 객체에 대해 알고 있는 경우, 즉 여러 객체가 연결 (chained) 되어 있는 경우
- 위 경우는 '자기 자신을 제외한 다른 객체에게 전송할 메시지의 이름을 알고 있음' 의 의존성임
- 테스트가 코드에 대해 갖는 의존성, 즉 테스트와 코드의 지나친 결합으로 테스트를 유지하는 비용이 테스트를 통해 얻는 가치보다 높아질 수 있음

# 3.2 약하게 결합된 코드 작성하기

# 3.3 의존성의 방향 관리하기

