// 한개 테스트하기

test("더하기 테스트", () => {
    const a = 1;
    const b = 2;

    expect(a+b).toBe(3); // 기대한다 a+b가 3이 되는것을 
});

// 여러개 묶음 테스트
describe("나의 테스트 그룹", () => {
    test("더하기 테스트", () => {
        const a = 1;
        const b = 2;
    
        expect(a + b).toBe(3); // 기대한다 a+b가 3이 되는것을 
    });

    test("더하기 테스트", () => {
        const a = 1;
        const b = 2;
    
        expect(a * b).toBe(3); // 기대한다 a+b가 3이 되는것을 
    });
});

// 3. 상품 구매하기 테스트 예제
describe("상품 구매 테스트", () => {

    // beforeAll(() => {
    //     // 모든것 검증하기전에 한번 실행 (예: 로그인)
    // });
    // beforeEach(() => {
    //     // 각각 테스트 전 실행 (초기값 설정)
    // });

    test("돈 검증하기", () => {
        const result = true; // 돈이 충분하다고 가정하기
        expect(result).toBe(true);
    });

    test("상품 구매하기", () => {
        const result = true; // 상품 구매했다고 가정하기
        expect(result).toBe(true);
    });
});