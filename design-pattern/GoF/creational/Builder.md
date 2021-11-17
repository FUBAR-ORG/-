# 빌더 패턴(`Builder Pattern`)

## 빌더 패턴이란?

복합 객체의 생성과정과 표현방법을 분리하여 동일한 생성 절차에서 서로 다른 표현 결과를 만들 수 있게 하는 패턴.

쉽게 말해, 복잡한 객체를 생성하는 클래스와, 해당 객체를 표현하는 클래스를 분리하는 방법.

> 생성자 오버로딩이라고 볼 수 있음.

---

## UML

![img.png](../../../assets/builder_uml.png)

---

## 빌더 패턴의 장단점

### 장점

- 필요한 데이터만 설정할 수 있음
- 유연성 확보
- 가독성 증진
- 불변성 확보
- 복합 객체를 생성하는 절차를 세밀하게 나눌 수 있음

### 단점

- 코드가 길어짐
  - 특히 `JavaScript`에서는 객체를 `immutable`하게 유지하기 위해 `private` 변수를 쓰는데, 그로 인해 코드의 양이 훨씬 늘어나게 된다. (`getter` 함수를 속성마다 만들어줘야 한다. `private` 변수를 사용하지 않으면 `User` 클래스의 `contructor`에서도 `builder`의 속성값들을 직접 불러올 수 있기 때문에 코드의 길이를 조금은 줄일 수 있다.)
- 길어진 코드 탓에 속성을 새로 추가하거나 제거하는 일이 번거로움.(기존 클래스와 빌더 클래스 모두 수정해야하기 때문.)

## 빌더 패턴 주 사용처

생성해야 하는 객체가 `Optional`한 속성을 많이 가질 때 유리.

```ts
class User {
  constructor(
    private name: string,
    private age: number,
    private height?: number | null,
    private weight?: number | null
  ) {}
}

const andy = new User("Andy", 10, null, 30);
const june = new User("June", 11, 150, null);
const gary = new User("Gary", 10);
```

1. 매번 파라미터의 순서를 체크해야하기 때문에 실수할 가능성 커짐.
2. 생성자에서 매개변수의 수가 많아졌을 때, 어떤 매개변수가 어떤 값을 의미하는지 헷갈림.
3. 초기화하지 않아도 되는 값임에도 생성자에서 처리해줘야 하기 때문에 가독성 하락.

`TypeScript`에서는 `Sequelize`, `TypeORM`과 같은 `Node.js`의 `ORM` 라이브러리에서 모델 생성과 `SQL` 조작 등에서 사용하고 있으며, 가독성이 뛰어난 것을 쉽게 확인할 수 있다.

## Example Code

- 예시에서 공통으로 사용되는 `Type`

```ts
type RequestProtocol = "http" | "https" | "file"; // ...
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"; // ...
type HttpHeaderContentType =
  | "application/json"
  | "application/x-www-form-urlencoded"; // ...
type HttpMode = "same-origin" | "no-cors" | "cors" | "navigate";

interface HttpHeader extends Record<string, string> {
  "Content-Type": HttpHeaderContentType;
}
```

1. 패턴을 적용하지 않은 단순한 소스 코드

```ts
class HttpRequest {
  constructor(
    private protocol: RequestProtocol,
    private url: string,
    private method: HttpMethod,
    // private mode: HttpMode,
    // 만약 매개변수가 추가된다면 모든 소스의 매개변수 순서도 수정해줘야함.
    private headers?: HttpHeader,
    private body?: ArrayBuffer | string
  ) {}

  public async send(): Promise<string> {
    return (
      await fetch(`${this.protocol}://${this.url}`, {
        method: this.method,
        headers: this.headers,
        // mode: this.mode,
        body: this.body,
      })
    ).text();
  }
}

const httpGetRequest = new HttpRequest("https", "www.google.co.kr", "GET");
httpGetRequest.send();
// 위에 사용 예시만 보고 순서 및 어떠한 데이터가 들어가는지 쉽게 추론할 수 없음.
// 자동완성, IDE에 의존해야하는 가독성.
const httpPostRequest = new HttpRequest(
  "https",
  "www.google.co.kr",
  "POST",
  {
    "Content-Type": "application/json",
  },
  "Hello, World!"
);
httpPostRequest.send();
```

---

2. 패턴을 적용한 소스 코드

```ts
class HttpRequest {
  constructor(
    private protocol: RequestProtocol,
    private url: string,
    private method: HttpMethod,
    private mode: HttpMode,
    private headers?: HttpHeader,
    private body?: ArrayBuffer | string // 만약 매개변수가 추가되더라도 Builder 객체에서 메서드만 추가해주면 됨.
  ) {}

  public async send(): Promise<string> {
    return (
      await fetch(`${this.protocol}://${this.url}`, {
        method: this.method,
        headers: this.headers,
        mode: this.mode,
        body: this.body,
      })
    ).text();
  }
}

class HttpRequestBuilder {
  private mode?: HttpMode;
  private headers?: HttpHeader;
  private body?: ArrayBuffer | string;

  constructor(private url: string, private method: HttpMethod) {}

  public setMode(mode: HttpMode): HttpRequestBuilder {
    this.mode = mode;
    return this;
  }

  public setHeaders(headers: HttpHeader): HttpRequestBuilder {
    this.headers = headers;
    return this;
  }

  public setBody(body: ArrayBuffer | string): HttpRequestBuilder {
    this.body = body;
    return this;
  }

  // 각 데이터를 추가하는 메서드 생성

  public build(): HttpRequest {
    return new HttpRequest(
      "https",
      this.url,
      this.method,
      this.mode,
      this.headers,
      this.body
    );
  }
}

class HttpGetRequestBuilder extends HttpRequestBuilder {
  constructor(url: string) {
    super(url, "GET");
  }
}

class HttpPostRequestBuilder extends HttpRequestBuilder {
  constructor(url: string) {
    super(url, "POST");
  }
}

const httpGetRequestBuilder = new HttpGetRequestBuilder("www.google.co.kr");
const httpGetRequest = httpGetRequestBuilder
  .setMode("cors")
  .setHeaders({
    "Content-Type": "application/json",
  })
  .setBody("request")
  .build();

httpGetRequest.send();

const httpPostRequestBuilder = new HttpPostRequestBuilder("www.google.co.kr");
const httpPostRequest = httpPostRequestBuilder
  .setMode("cors")
  .setHeaders({
    "Content-Type": "application/json",
  })
  .setBody("request")
  .build();

httpGetRequest.send();
```

---

3. `Inner Builder Class`를 적용한 소스 코드

```ts
class HttpRequest {
  constructor(
    private protocol: RequestProtocol,
    private url: string,
    private method: HttpMethod,
    private mode: HttpMode,
    private headers?: HttpHeader,
    private body?: ArrayBuffer | string
  ) {}

  public async send(): Promise<string> {
    return (
      await fetch(`${this.protocol}://${this.url}`, {
        method: this.method,
        headers: this.headers,
        mode: this.mode,
        body: this.body,
      })
    ).text();
  }

  static get Builder() {
    class Builder {
      private protocol: RequestProtocol;
      private url: string;
      private method: HttpMethod;
      private mode: HttpMode;
      private headers?: HttpHeader;
      private body?: ArrayBuffer | string;

      public setProtocol(protocol: RequestProtocol): Builder {
        this.protocol = protocol;
        return this;
      }

      public setUrl(url: string): Builder {
        this.url = url;
        return this;
      }

      public setMethod(method: HttpMethod): Builder {
        this.method = method;
        return this;
      }

      public setMode(mode: HttpMode): Builder {
        this.mode = mode;
        return this;
      }

      public setHeaders(headers: HttpHeader): Builder {
        this.headers = headers;
        return this;
      }

      public setBody(body: ArrayBuffer | string): Builder {
        this.body = body;
        return this;
      }

      public build(): HttpRequest {
        return new HttpRequest(
          this.protocol,
          this.url,
          this.method,
          this.mode,
          this.headers,
          this.body
        );
      }
    }
    return new Builder();
  }
}

const httpRequest = HttpRequest.Builder.setProtocol("http")
  .setUrl("www.google.co.kr")
  .setMethod("GET")
  .build();

httpRequest.send();
```

---

4. `Builder Class` 상속을 적용한 소스 코드

```js
class Builder {
  init() {
    Object.keys(this).forEach((key) => {
      const setterName = `set${key.substr(0, 1).toUpperCase()}${key.substr(1)}`;

      this[setterName] = (value) => {
        this[key] = value;
        return this;
      };
    });
  }

  build() {
    return this;
  }
}

class HttpRequest extends Builder {
  constructor() {
    super();
    this.protocol = 'http';
    this.url = '';
    this.method = 'GET';
    this.mode = 'cors';
    this.headers = undefined;
    this.body = undefined;
    user.init();
  }

  public async send() {
    return (
      await fetch(`${this.protocol}://${this.url}`, {
        method: this.method,
        headers: this.headers,
        mode: this.mode,
        body: this.body,
      })
    ).text();
  }
}

const httpRequest = new HttpRequest().setProtocol("http")
  .setUrl("www.google.co.kr")
  .setMethod("GET")
  .build();

httpRequest.send();
```

---

## 참고 자료

- [위키 백과](https://ko.wikipedia.org/wiki/%EB%B9%8C%EB%8D%94_%ED%8C%A8%ED%84%B4)
- [HERSTORY Blog](https://4z7l.github.io/2021/01/19/design_pattern_builder.html)
- [TTUM TISTORY Blog](https://ttum.tistory.com/35)
