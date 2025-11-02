---
name: payment-integration
description: Toss Payments, Stripe, PayPal 등 결제 시스템을 웹사이트에 통합하는 스킬. 정기결제, 일회성 결제, 환불 처리까지 완벽 가이드.
version: 1.0.0
author: BSD Vibe Coding Center
tags: [payment, toss, stripe, ecommerce, checkout]
---

# 💳 결제 시스템 통합 스킬

이 스킬은 BSD 바이브코딩 수강생들이 **온라인 결제 시스템**을 쉽고 안전하게 구축할 수 있도록 돕습니다.

## 📋 이 스킬이 하는 일

1. **플랫폼 선택**: 비즈니스에 맞는 결제 서비스 추천
2. **기본 통합**: API 연동 및 결제 페이지 구현
3. **보안 설정**: PCI DSS 준수, 데이터 암호화
4. **테스트**: 샌드박스 환경에서 결제 시뮬레이션
5. **운영 지원**: 환불, 분쟁 처리, 정산 관리

## 🎯 언제 이 스킬을 사용하나요?

- "온라인 강의 판매를 위한 결제 시스템이 필요해요"
- "월 구독 서비스를 만들고 싶어요"
- "이커머스 사이트에 결제 기능을 추가하고 싶어요"
- "Toss Payments를 내 사이트에 연동하고 싶어요"

## 🛠️ 주요 결제 플랫폼 비교

### 🇰🇷 Toss Payments (국내 1순위 추천) ⭐⭐⭐
**장점**:
- 한국 시장 특화 (카카오페이, 네이버페이 등)
- 간편한 API
- 빠른 정산 (D+1)
- 합리적인 수수료 (2.9%)
- 한글 문서 풍부

**단점**:
- 글로벌 결제 약함
- 일부 카드사 제한

**추천 대상**:
- 한국 고객 대상 비즈니스
- 빠른 정산 필요
- SaaS, 온라인 강의, 이커머스

**수수료**:
```
- 카드 결제: 2.9%
- 간편결제: 2.9%
- 계좌이체: 1.0%
- 가상계좌: 1.0% + 300원
```

### 🌍 Stripe (글로벌 추천) ⭐⭐⭐
**장점**:
- 135개국 지원
- 강력한 API
- 정기결제 최적화
- Stripe Checkout (노코드 결제 페이지)
- 풍부한 문서와 커뮤니티

**단점**:
- 한국 정산 복잡
- 수수료 높음 (3.6% + 260원)
- 한글 지원 제한적

**추천 대상**:
- 글로벌 고객 대상
- SaaS 구독 서비스
- 복잡한 결제 로직 필요

**수수료**:
```
- 국내 카드: 3.6% + 260원
- 해외 카드: 3.95% + 260원
- 정기결제: 동일
```

### 💰 PayPal ⭐⭐
**장점**:
- 전 세계적 인지도
- 구매자 보호 정책
- 간단한 통합

**단점**:
- 높은 수수료 (4.4% + 고정)
- 분쟁 처리 복잡
- 정산 느림

**추천 대상**:
- 글로벌 이커머스
- PayPal 필수 고객층
- B2B 거래

### 🏦 KakaoPay, NaverPay ⭐⭐
**장점**:
- 대중적 인지도
- 간편 결제
- 모바일 최적화

**단점**:
- 다른 결제 수단 병행 필요
- 수수료 협상 어려움
- 단독 사용 제한적

**추천 대상**:
- 모바일 커머스
- 20-40대 타겟
- 추가 결제 수단

## 💡 결제 시스템 선택 가이드

### 질문으로 찾는 최적 플랫폼

**Q1: 주요 고객은 어디인가요?**
- 한국 → Toss Payments
- 글로벌 → Stripe
- 양쪽 → Stripe + Toss Payments

**Q2: 어떤 종류의 결제인가요?**
- 일회성 → Toss Payments, Stripe 모두 OK
- 정기구독 → Stripe 추천
- 마켓플레이스 (판매자 여럿) → Stripe Connect

**Q3: 예산은?**
- 최소 수수료 → Toss Payments (2.9%)
- 기능 중요 → Stripe (높지만 강력)

**Q4: 기술 역량은?**
- 초보 → Toss Payments (한글 문서)
- 중급 이상 → Stripe (자유도 높음)

## 🚀 Toss Payments 통합 가이드

### Step 1: 계정 생성
```
1. https://toss.im 접속
2. "비즈니스 시작하기" 클릭
3. 사업자 정보 입력
4. 심사 대기 (1-2 영업일)
5. 승인 후 API 키 발급
```

### Step 2: API 키 발급
```
1. 개발자센터 접속
2. "API 키 관리"
3. 테스트/프로덕션 키 확인

테스트 키:
- Client Key: test_ck_...
- Secret Key: test_sk_...

⚠️ Secret Key는 절대 노출 금지!
```

### Step 3: 기본 결제 페이지 구현

#### Frontend (결제 요청)
```html
<!DOCTYPE html>
<html>
<head>
  <title>결제하기</title>
  <script src="https://js.tosspayments.com/v1/payment"></script>
</head>
<body>
  <button id="payment-button">결제하기</button>

  <script>
    // Client Key로 초기화
    const clientKey = 'test_ck_YOUR_CLIENT_KEY';
    const tossPayments = TossPayments(clientKey);

    // 결제 버튼 클릭 시
    document.getElementById('payment-button').addEventListener('click', function() {
      tossPayments.requestPayment('카드', {
        amount: 50000, // 결제 금액
        orderId: 'ORDER_' + new Date().getTime(), // 주문 ID (고유값)
        orderName: '바이브코딩 마스터클래스', // 상품명
        customerName: '홍길동', // 고객 이름
        customerEmail: 'customer@email.com', // 고객 이메일
        successUrl: window.location.origin + '/success', // 성공 시 리디렉션
        failUrl: window.location.origin + '/fail', // 실패 시 리디렉션
      }).catch(function (error) {
        if (error.code === 'USER_CANCEL') {
          alert('결제가 취소되었습니다.');
        } else {
          alert('결제 중 오류가 발생했습니다: ' + error.message);
        }
      });
    });
  </script>
</body>
</html>
```

#### Backend (결제 승인)
```javascript
// Node.js + Express 예시
const express = require('express');
const axios = require('axios');

const app = express();
const SECRET_KEY = 'test_sk_YOUR_SECRET_KEY';

app.get('/success', async (req, res) => {
  const { paymentKey, orderId, amount } = req.query;

  try {
    // Toss Payments에 결제 승인 요청
    const response = await axios.post(
      'https://api.tosspayments.com/v1/payments/confirm',
      {
        paymentKey: paymentKey,
        orderId: orderId,
        amount: amount
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(SECRET_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // 승인 성공
    const payment = response.data;
    
    // 여기서 DB에 주문 정보 저장
    // saveOrderToDatabase(payment);

    res.send(`
      <h1>결제 성공!</h1>
      <p>주문번호: ${payment.orderId}</p>
      <p>결제금액: ${payment.totalAmount.toLocaleString()}원</p>
    `);
  } catch (error) {
    console.error('결제 승인 실패:', error.response.data);
    res.status(400).send('결제 승인에 실패했습니다.');
  }
});

app.listen(3000, () => {
  console.log('서버 실행 중: http://localhost:3000');
});
```

### Step 4: 정기결제 (빌링) 구현

#### 카드 등록
```javascript
// 카드 등록 요청
tossPayments.requestBillingAuth('카드', {
  customerKey: 'CUSTOMER_' + userId, // 고유 고객 ID
  successUrl: window.location.origin + '/billing/success',
  failUrl: window.location.origin + '/billing/fail',
});
```

#### 정기결제 실행
```javascript
// 서버에서 정기결제 실행
const axios = require('axios');

async function chargeBilling(billingKey, amount, orderName) {
  const response = await axios.post(
    `https://api.tosspayments.com/v1/billing/${billingKey}`,
    {
      customerKey: 'CUSTOMER_123',
      amount: amount,
      orderId: 'SUB_' + new Date().getTime(),
      orderName: orderName
    },
    {
      headers: {
        Authorization: `Basic ${Buffer.from(SECRET_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data;
}

// 매달 1일에 자동 결제
const cron = require('node-cron');

cron.schedule('0 0 1 * *', async () => {
  // DB에서 구독 중인 사용자 조회
  const subscribers = await getActiveSubscribers();
  
  for (const sub of subscribers) {
    try {
      await chargeBilling(sub.billingKey, 29000, '월간 구독');
      console.log(`${sub.email} 결제 성공`);
    } catch (error) {
      console.error(`${sub.email} 결제 실패:`, error.message);
      // 실패 알림 발송
    }
  }
});
```

## 🌍 Stripe 통합 가이드

### Step 1: Stripe Checkout (노코드 방식)

#### 가장 간단한 방법
```javascript
// 서버 코드
const stripe = require('stripe')('sk_test_YOUR_SECRET_KEY');

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'krw',
          product_data: {
            name: '바이브코딩 마스터클래스',
            images: ['https://example.com/course-image.jpg'],
          },
          unit_amount: 350000, // 350,000원 (원 단위)
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}/cancel`,
  });

  res.json({ id: session.id });
});
```

#### 프론트엔드
```html
<script src="https://js.stripe.com/v3/"></script>
<button id="checkout-button">결제하기</button>

<script>
  const stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY');
  
  document.getElementById('checkout-button').addEventListener('click', async () => {
    const response = await fetch('/create-checkout-session', {
      method: 'POST',
    });
    
    const session = await response.json();
    
    // Stripe Checkout 페이지로 리디렉션
    const result = await stripe.redirectToCheckout({
      sessionId: session.id
    });
    
    if (result.error) {
      alert(result.error.message);
    }
  });
</script>
```

### Step 2: 정기구독 (Subscription)
```javascript
// 구독 상품 생성 (한 번만 실행)
const product = await stripe.products.create({
  name: '월간 프리미엄 멤버십',
});

const price = await stripe.prices.create({
  product: product.id,
  unit_amount: 29000, // 29,000원
  currency: 'krw',
  recurring: {
    interval: 'month', // month, year 등
  },
});

// Checkout Session 생성
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [
    {
      price: price.id,
      quantity: 1,
    },
  ],
  mode: 'subscription', // 'payment' 대신 'subscription'
  success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${YOUR_DOMAIN}/cancel`,
});
```

### Step 3: 웹훅 (Webhook) 설정

#### 웹훅이 필요한 이유
```
고객이 결제하면 Stripe가 우리 서버에 알림을 보냄
→ 우리는 이 알림을 받아서 DB 업데이트, 이메일 발송 등 처리
```

#### 웹훅 엔드포인트
```javascript
const endpointSecret = 'whsec_YOUR_WEBHOOK_SECRET';

app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 이벤트 타입별 처리
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('결제 성공:', paymentIntent.id);
      // DB에 주문 저장, 이메일 발송 등
      break;
      
    case 'customer.subscription.created':
      const subscription = event.data.object;
      console.log('구독 시작:', subscription.id);
      // 구독 정보 DB 저장
      break;
      
    case 'customer.subscription.deleted':
      const canceledSub = event.data.object;
      console.log('구독 취소:', canceledSub.id);
      // 구독 상태 업데이트
      break;
      
    default:
      console.log(`처리되지 않은 이벤트: ${event.type}`);
  }

  res.send();
});
```

## 💬 실전 예제

### 예제 1: 온라인 강의 결제

**사용자**: "온라인 강의 판매 페이지를 만들고 Toss Payments로 결제 받고 싶어요. 강의 가격은 35만원이에요."

**Claude**:
```
온라인 강의 결제 시스템을 구축해드리겠습니다!

📋 구현 계획:

1️⃣ 강의 소개 랜딩페이지
   - 강의 내용, 커리큘럼
   - 수강 후기
   - "수강 신청하기" CTA

2️⃣ Toss Payments 결제
   - 카드, 간편결제 지원
   - 350,000원 일회성 결제

3️⃣ 결제 완료 후 처리
   - 수강 계정 자동 생성
   - 로그인 정보 이메일 발송
   - 강의 플랫폼 접속 링크 제공

🛠️ 필요한 것:
1. Toss Payments 가입 (사업자등록증 필요)
2. 웹 호스팅 (Vercel, Netlify 무료 가능)
3. 이메일 발송 (SendGrid 무료 플랜)

💰 예상 비용:
- Toss 수수료: 10,150원 (2.9%)
- 실수령: 339,850원

시작해볼까요? 먼저 Toss Payments 계정이 있으신가요?
```

### 예제 2: SaaS 월 구독

**사용자**: "SaaS 제품을 월 29,000원에 구독 판매하고 싶어요. 매달 자동 결제되게 해주세요."

**Claude**:
```
SaaS 구독 결제 시스템을 설계해드리겠습니다!

📊 구독 플랜 설계:

기본 플랜: 29,000원/월
- 첫 결제 시 카드 등록
- 매월 1일 자동 결제
- 취소 시 다음 결제일 전까지 사용 가능

🔧 기술 스택 추천:

Option A: Stripe (추천 ⭐)
✅ 구독 관리 기능 강력
✅ 자동 재시도, 실패 알림
✅ 고객 포털 (카드 변경, 취소 셀프 서비스)
❌ 수수료 높음 (3.6% + 260원 = 1,304원)

Option B: Toss Payments
✅ 수수료 저렴 (2.9% = 841원)
✅ 한국 고객 친화적
❌ 구독 관리 직접 구현 필요

💡 추천: Stripe
이유: 구독 관리 자동화로 개발 시간 90% 절감

⚡ 구현 플로우:

[고객 회원가입]
    ↓
[플랜 선택 및 카드 등록]
    ↓
[Stripe가 매월 1일 자동 결제]
    ↓
[성공 시: 서비스 계속 제공]
[실패 시: 3회 재시도 후 알림]
    ↓
[고객이 카드 업데이트 또는 취소]

🎨 고객 경험:

1. 회원가입
2. "구독 시작하기" 클릭
3. Stripe Checkout 페이지로 이동
4. 카드 정보 입력
5. 즉시 서비스 이용 시작
6. 매달 자동 결제 (이메일 영수증 발송)

상세 코드를 작성해드릴까요?
```

## ⚠️ 보안 및 주의사항

### 1. API 키 관리
```
✅ 절대 지켜야 할 것:
□ Secret Key를 코드에 하드코딩 금지
□ GitHub에 업로드 금지
□ 환경 변수 (.env) 사용

.env 예시:
TOSS_SECRET_KEY=test_sk_...
STRIPE_SECRET_KEY=sk_test_...

코드:
const SECRET_KEY = process.env.TOSS_SECRET_KEY;
```

### 2. 결제 금액 검증
```javascript
// ❌ 나쁜 예: 프론트엔드에서 보낸 금액 그대로 사용
app.post('/payment', (req, res) => {
  const { amount } = req.body; // 조작 가능!
  // 결제 진행
});

// ✅ 좋은 예: 서버에서 금액 재계산
app.post('/payment', (req, res) => {
  const { productId, quantity } = req.body;
  
  // DB에서 실제 가격 조회
  const product = getProductFromDB(productId);
  const amount = product.price * quantity;
  
  // 이 금액으로 결제 진행
});
```

### 3. 주문 ID 유일성 보장
```javascript
// ❌ 나쁜 예: 순차 번호 (예측 가능)
const orderId = '1001';

// ✅ 좋은 예: UUID 또는 타임스탬프 조합
const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
```

### 4. HTTPS 필수
```
⚠️ 결제 정보는 반드시 HTTPS로 전송!

무료 SSL 인증서:
- Let's Encrypt
- Cloudflare (무료 플랜)
- Vercel, Netlify (자동 제공)
```

## 📊 환불 및 분쟁 처리

### Toss Payments 환불
```javascript
const axios = require('axios');

async function refundPayment(paymentKey, reason) {
  const response = await axios.post(
    `https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`,
    {
      cancelReason: reason
    },
    {
      headers: {
        Authorization: `Basic ${Buffer.from(SECRET_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data;
}

// 사용 예시
await refundPayment('payment_key_123', '고객 변심');
```

### 부분 환불
```javascript
// 10,000원만 환불
await axios.post(
  `https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`,
  {
    cancelReason: '부분 환불',
    cancelAmount: 10000
  },
  { headers: { ... } }
);
```

## 🎓 BSD 학생 특화 기능

### 1. 템플릿 제공
```
"BSD 온라인 강의 결제 템플릿" →
바로 사용 가능한 풀스택 코드 제공
```

### 2. 수수료 계산기
```
"매출 500만원일 때 순이익은?" →
플랫폼별 수수료 차감 후 실수령액 자동 계산
```

### 3. 법적 문서 템플릿
```
"이용약관 및 환불 정책 만들어줘" →
전자상거래법 준수 템플릿 제공
```

### 4. 테스트 카드
```
Toss Payments 테스트 카드:
- 카드번호: 5192 1234 5678 9012
- 유효기간: 12/30
- CVC: 123

Stripe 테스트 카드:
- 성공: 4242 4242 4242 4242
- 실패: 4000 0000 0000 0002
```

## 🚀 빠른 시작 명령어

### 기본 통합
```
"Toss Payments 결제 연동 코드 만들어줘"
"Stripe로 정기구독 시스템 구축해줘"
```

### 트러블슈팅
```
"결제는 되는데 승인이 안 돼요"
"웹훅이 작동하지 않아요"
```

---

## 🎯 핵심 정리

이 스킬을 사용하면:
✅ 안전한 온라인 결제 시스템 구축
✅ 일회성 & 정기결제 모두 지원
✅ 한국 & 글로벌 고객 대응
✅ PCI DSS 준수 자동 처리
✅ 환불, 분쟁 관리 용이

**BSD 학생이라면**: 이 스킬로 온라인 비즈니스를 수익화하거나, 클라이언트에게 결제 시스템 구축 서비스를 제공할 수 있습니다! 💳
