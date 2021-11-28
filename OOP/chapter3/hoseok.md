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
## 3.2.1 의존성 주입하기
---
- 클래스의 이름을 통해 다른 클래스를 참조하는 방식은 상당히 끈적이는 지점을 만들어낸다

```cpp
class Gear
{
private:
int chainring;
int cog;
int rim;
double tire;
public:
Gear(int chainring, int cog, int rim, double tire)
: chainring(chainring),
cog(cog),
rim(rim),
tire(tire)
{
}

int gear_inches()
{
Wheel wheel(rim, tire);
return ratio * wheel.diameter()
}
}

Gear gear(52, 11, 26, 1.5);
gear.gear_inches()
```

- Wheel 클래스의 이릉르 직접 참조할 때, 가장 눈에 띄는 결과는 Wheel 클래스의 이름이 바뀌면 Gear의 gear_inches 메서드도 함께 변경되어야 한다는 것
- gear_inches 메서드 속에 하드코딩해 놓았을 때 Gear는 Wheel 인스턴스의 gear inches만을 계산하겠다고 명시적으로 선언한 것
- 위 문제는 지름을 가지고 있고 기어를 사용하는 다른 종류의 객체와 협업하기 힘듦
- 이후에 자전거 디스크나 실린더 같은 객체를 다루게 되었을 때, 이 객체들은 gear inches를 사용해야 하지만, Gear는 Wheel에 붙어 있기 때문에 gear inches를 계산할 수 없음
- 중요한 것은 '객체의 클래스가 무엇인지'아 아니라, '우리가 전송하는 메시지가 무엇인지' 임
- 따라서, 아래와 같이 Ger에게는 diameter를 알고 있는 객체만 있으면 됨 ( 의존성 주입 )

```cpp
class Gear
{
private:
int chainring;
int cog;
Wheel wheel;
public:
Gear(int chainring, int cog, Wheel wheel)
: chainring(chainring),
cog(cog),
wheel(wheel)
{
}

double gear_inches()
{
return ratio * wheel.diameter()
}
}
```

- 위에서 이제 Wheel 클래스에 대해 알아야 할 책임은 누구에게 있는가 라는 문제가 야기됨

## 3.2.2 의존성 격리시키기
---
- 불요한 의존성을 모두 제거하면 가장 좋겠지만 아쉽게도 기술적으로는 가능해도 현실적으로 어려움

### 인스턴스 생성을 격리시키기
---
- 만약 제약조건이 너무 ㅁ낳아서 Gear에 Wheel을 주입(inject)할 수 없다면 새로운 Wheel 인스턴스를 만드는 과정을 Gear 내부에 격리시켜 놓을 피료가 있음

#### 예시
A) 새로운 Wheel 인스턴스를 생성하는 과정을 Gear의 gear_inches 메서드에서 initialize 메서드 속으로 옮김
```cpp
class Gear
{
private:
int chainring;
int cog;
int rim;
double tire;
Wheel wheel;
public:
Gear(int chainring, int cog, int rim, double tire)
:chainring(chainring),
cog(cog),
rim(rim),
tire(tire)
{
wheel = new Wheel(rim, tire);
}

double gear_inches()
{
return ratio * wheel.diameter();
}
}
```

B) Wheel 인스턴스를 생성하는 과정을 새로운 메서드에서 생성하도록 수정
```cpp
class Gear
{
private:
int chainring;
int cog;
int rim;
double tire;
Wheel wheel;
public:
Gear(int chainring, int cog, int rim, double tire)
:chainring(chainring),
cog(cog),
rim(rim),
tire(tire)
{
}

double gear_inches()
{
return ratio * wheel.diameter();
}

void getWheel()
{
wheel = new Wheel(rim,tire);
}
}
```

- 위 두 예시도 Gear와 Wheel은 의존성을 가지지만, 이전 코드 ( gear_inches내부에서 Wheel을 생성하는 코드 )보다 의존성을 뚜렷하게 만들어서, 재사용이 수월하도록 만듦

- 의존성을 염두에 두고 의존성을 주입하는 코딩 습관을 들일 때 클래스는 자연스럽게 덜 결합된 형태를 띄게 됨
- 클래스 이름에 대한 의존성이 간단명료하고 잘 정리되어 있는 클래스라면 새로운 요구사항을 받아들이기가 쉬워짐

#### 외부로 전송하는 메시지 중 위험한 것들을 격리시키기
---
외부로 전송되는 메시지 ( 나 자신 아닌 객체에게 보내는 메시지 ) 로 시선을 돌리자

```cpp
double gear_inches()
{
//...무시무시한 수학공식 몇 줄
foo = some_intermediate_result * wheel.diameter()
//...무시무시한 수학 공식 몇 줄 더
}
```

- 위 코드에서 wheel.diameter는 gear_inches 내부에 있으며, 이는 gear_inches는 wheel.diameter에 의존성을 가진다라 말할 수있음
이는 dear_inchest를 취약하게 만든다 할 수 있음

```cpp
{
//...무시무시한 수학공식 몇 줄
foo = some_intermediate_result * diameter()
//...무시무시한 수학 공식 몇 줄 더

double diameter()
{
return wheel.diameter()
}
}
```

- 위는 gear_inches 메서드에서 외부에 대한 의존성을 걷어내고 Gear 클래스 내부의 메서드 속에 캡슐화 시킨 것임
- 이는 DRY ( don't Repeat yourself ) 하게 유지할 수 있으며, gear_inches 메서드에서 의존성을 제거하는 효과를 가져올 수 있음
- Wheel 클래스가 자신이 구현하고 있는 diameter 메서드의 이름과 시그니처를 - 바꾸더라도 Gear 클래스에게 미치는 영향은 래퍼 메서드 ( Gear 클래스에서 내부 diameter 함수 )에 한정되는 효과 또한 얻을 수 있음

## 3.2.3 인자 순서에 대한 의존성 제거하기
---
- cpp에서 사용할 수 없다고 판단
- 생성자 파라매터에 해시 값을 사용할 수 없기 때문
- 본 절은 파라매터에 해시 값을 사용하는 것이 키 포인트라 생각되어 정리하지 않았음

# 3.3 의존성의 방향 관리하기
---

- 모든 의존성은 방향이 있음

## 3.3.1 의존성의 방향 바꾸기
---

```cpp
class Gear
{
private:
int chainring;
int cog;

public:
Gear(int chainring, int cog)
:chainring(chainring),
cog(cog)
{
}

double gear_inches(double diameter)
{
return ratio() * diameter;
}

double ratio()
{
return static_cast<float>(chainring / cog);
}
}

class Wheel
{
private:
int rim;
double tire;
Gear gear;
public:
Wheel(int rim, double tire, Gear gear)
:rim(rim),
tire(tire),
gear(gear)
{
return gear.gear_inches(diameter());
}
}

Wheel wheel = new Wheel(26, 1.5, gear);
```
- 이전 예시는 Gear가 wheel의 diameter에 의존했지만, 위 예시는 Wheel이 Gear의 gear_inches 에 의존하고 있는 것을 볼 수 있음
- 애플리케이션은 변할 수밖에 없기 때문에, 이 의존성의 방향 또한 잘 선택하는 것이 중요함

## 3.3.2 의존성의 방향 결정하기
---
- 사람으로 생각하면 자기 자신보다 덜 변하는 사람들에 의존하라고 말할 수 있음
이는 클래스에도 동일하게 적용되어야 하는 말임

- 어떤 클래스는 다른 클래스에 비해 요구사항이 더 자주 바뀜
- 구체 클래스 ( concrete classes )는 추상 클래스 ( avstract classes ) 보다 수정해야 하는 경우가 빈번히 발생함
- 의존성이 높은 클래스를 변경하는 것은 코드의 여러 곳에 영향을 미친다

- 종종 의미가 겹치는 경우가 있지만 각각 독립적이고 의미가 뚜렷한 주장임

### 변경될 가능성이 높은지 이해하기
- 어떤 클래스가 다른 클래스보다 변경될 가능성이 높다는 인식
- 왜 변경되는가와는 상관없이 애플리케이션에서 사용하는 모든 클래스는 '다른 클래스와 비교해서 얼마나 변경되지 않는지'를 기준으로 순위를 매길 수 있음
- 위 기준으로 매겨진 순위는 의존성의 방향을 결정하는데 핵심적임

### 구체적인 것과 추상적인 것을 인지하기
- 코드의 구체성과 추상성을 이해하는 데서 시작됨
- 인터페이스를 먼적 작성하고 diameter를 인터페이스의 일부로 정의하고 이 인터페이스를 Wheel 클래스에 포함시키고 Gear 클래스에게 우리가 지금 주입하는 클래스가 이런 인터페이스의 한 종류라고 알려줘야할 것임
- 추상화된 인터페이스는 인터페이스가 기반하고 있던 구체 클래스보다 변경될 일이 훨씬 적음
- 이런 인터페이스도 의존성이 있기 때문에 디자인을 할 때 중요하게 고려해야 함

### 의존성이 높은 클래스 만들지 않기
- 의존성이 높은 클래스를 만들면 그 대가를 지불해야 함
의존성이 높은 클래스를 수정할 때 의존성을 가진 다른 클래스를 함께 수정해야하는 비용이 발생함

핵심 : '자기 자신보다 덜 변하는 것들에 의존하라'