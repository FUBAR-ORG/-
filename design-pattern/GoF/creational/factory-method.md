# 팩토리 메서드 ( Factory Method )
## 팩토리 메서드 란?
객체를 생성하기 위한 인터페이스를 정의하고, 어떤 클래스의 인스턴스를 생성할지에 대한 처리는 서브클래스가 결정하는 디자인 패턴

## 팩토리 메서드 장/단점
### 장점
- 생성자에 이름 부여 가능
- 호출할 때마다 새로운 객체를 생성할 필요 없음
- 하위 자료형 객체 반환 가능
- 객체 생성 캡슐화 가능
### 단점
- 클래스 수가 불필요하게 많아질 수 있음

## 팩토리 메서드 주 사용처
- 조건에 따라 생성해야 될 객체가 다를 때

```cpp
namespace std;

class Node
{
public:
    virtual void print() = 0;
}

class NodeA : public Node
{
public:
    void print()
    {
        cout << "print : NodeA " << endl;
    }
}

class NodeB : public Node
{
public:
    void print()
    {
        cout << "print : NodeB " << endl;
    }
}

class NodeFactory
{
public:
    virtual Node GetInstance(char Char) = 0;
}

class NodeMarchine
{
public:
    Node GetInstance(char Char)
    {
        switch(Char)
        {
        case 'A':
        {
            return new NodeA();
        }
        case 'B':
        {
            return new NodeB();
        }
        default:
        {
            cout << "GetInstance Error" << endl;
        }
        }
    }
}

void main()
{
    NodeFactory nodeFactory = new NodeMarchine();

    Node nodeA = nodeFactory.GetInstance('A');
    Node nodeB = nodeFactory.GetInstance('B');

    nodeA.print();
    nodeB.print();

    delete nodeFactory;
}
```

## Example Code
```cpp
class Document
{
public:
    virtual void extractDocument() = 0;
}

class WordDoc : public Document
{
public:
    void extractDocument()
    {
        //make Word Document...
    }
}

class PDFDoc : public Document
{
public:
    void extractDocument()
    {
        //make PDF Document...
    }
}

class ExcelDoc : public Document
{
public:
    void extractDocument()
    {
        //make Excel Document...
    }
}

enum DocType
{
    Word,
    PDF,
    Excel,
}

class DocFactory
{
public:
    virtual Docment GetInstance(DocType docType) = 0;
}

class DocMarchine : public DocFactory
{
public:
    Document GetInstance(DocType docType)
    {
        switch(docType)
        {
        case DocType::Word:
        {
            return new WordDoc();
        }
        case DocType::PDF:
        {
            return new PDFDoc();
        }
        case DocType::Excel:
        {
            return new ExcelDoc();
        }
        default:
        {
            cout << "extract Document Error" << endl;
        }
        }
    }
}

int main()
{
    DocFactory docFactory = new DocMarchine();

    Document wrod = docFactory.GetInstance(DocType::Word);
    Document pdf = docFactory.GetInstance(DocType::PDF);
    Document excel = docFactory.GetInstance(DocType::Excel);

    word.extractDocument();
    pdf.extractDocument();
    excel.extractDocument();

    delete docFactory;
}
```

## 참고자료
[gmlwjd9405 Blog](https://gmlwjd9405.github.io/2018/08/07/factory-method-pattern.html)

[devys Blog](https://velog.io/@ljinsk3/%EC%A0%95%EC%A0%81-%ED%8C%A9%ED%86%A0%EB%A6%AC-%EB%A9%94%EC%84%9C%EB%93%9C%EB%8A%94-%EC%99%9C-%EC%82%AC%EC%9A%A9%ED%95%A0%EA%B9%8C)

[bamdule Blog](https://bamdule.tistory.com/157)
