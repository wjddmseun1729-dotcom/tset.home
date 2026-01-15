# 구글 시트 연동 설정 가이드

## 1. Google Apps Script 설정

### 1-1. 구글 시트 열기
1. 스프레드시트 ID로 접속:
   ```
   https://docs.google.com/spreadsheets/d/1AnB3ogO3JXggy39OTYKsLtWfmEva68OjjdqGh9EnLxk/edit
   ```

### 1-2. Apps Script 에디터 열기
1. 구글 시트 상단 메뉴: **확장 프로그램** → **Apps Script**
2. 새 프로젝트가 열립니다

### 1-3. 코드 붙여넣기
1. 기본 코드를 모두 삭제
2. `google-apps-script-code.js` 파일의 전체 내용을 복사하여 붙여넣기
3. 파일명을 `리드수집API`로 변경 (선택사항)

### 1-4. 저장 및 배포
1. **저장** 버튼 클릭 (또는 Ctrl+S)
2. 상단 **배포** → **새 배포** 클릭
3. 배포 설정:
   - **유형 선택**: "웹 앱" 선택
   - **설명**: "리드 수집 API"
   - **다음 계정으로 실행**: "나"
   - **액세스 권한**: "**모든 사용자**" ⚠️ 중요!
4. **배포** 버튼 클릭
5. 권한 승인:
   - "액세스 권한 부여" 클릭
   - Google 계정 선택
   - "고급" → "안전하지 않은 페이지로 이동" 클릭
   - "허용" 클릭

### 1-5. 웹 앱 URL 복사
배포 완료 후 나타나는 **웹 앱 URL**을 복사합니다.
```
https://script.google.com/macros/s/AKfy.../exec
```
⚠️ 이 URL을 안전한 곳에 저장하세요!

---

## 2. Next.js 앱 연동

### 2-1. 환경 변수 설정
프로젝트 루트에 `.env.local` 파일 생성:

```bash
# .env.local
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### 2-2. page.tsx 수정
`app/page.tsx` 파일의 `handleSubmit` 함수를 아래 코드로 교체:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // Google Apps Script로 데이터 전송
    const response = await fetch(process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL!, {
      method: 'POST',
      mode: 'no-cors', // CORS 우회
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    // 성공 메시지 표시
    setShowSuccess(true);

    // 폼 초기화
    setFormData({
      company: '',
      name: '',
      email: '',
      phone: '',
      industry: '',
      budget: '',
      message: ''
    });

    // 5초 후 성공 메시지 숨기기
    setTimeout(() => setShowSuccess(false), 5000);

    console.log('데이터가 구글 시트에 저장되었습니다.');
  } catch (error) {
    console.error('제출 오류:', error);
    alert('제출 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
};
```

---

## 3. 테스트

### 3-1. 개발 서버 재시작
```bash
npm run dev
```

### 3-2. 폼 제출 테스트
1. http://localhost:3003 접속
2. 리드 폼 작성 및 제출
3. 구글 시트에서 데이터 확인

### 3-3. 확인 사항
- ✅ 구글 시트에 "리드데이터" 시트가 생성되었는가?
- ✅ 헤더 행이 파란색으로 표시되었는가?
- ✅ 제출한 데이터가 새 행으로 추가되었는가?
- ✅ 제출 시간이 한국 시간으로 표시되었는가?

---

## 4. 추가 기능 (선택사항)

### 4-1. 이메일 알림 활성화
`google-apps-script-code.js`의 `doPost` 함수에서:

1. 이메일 주소 변경:
```javascript
const recipient = 'your-email@example.com'; // 본인 이메일로 변경
```

2. `sheet.appendRow()` 이후에 추가:
```javascript
sheet.appendRow([...]);

// 이메일 알림 전송
sendEmailNotification(data);
```

3. 다시 저장 및 배포

### 4-2. Slack 연동
Slack Webhook URL을 사용하여 알림 전송:

```javascript
function sendSlackNotification(data) {
  const webhookUrl = 'YOUR_SLACK_WEBHOOK_URL';
  const payload = {
    text: `🎯 신규 리드: ${data.company} - ${data.name}\n이메일: ${data.email}\n연락처: ${data.phone}`
  };

  UrlFetchApp.fetch(webhookUrl, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  });
}
```

---

## 5. 문제 해결

### CORS 오류
- `mode: 'no-cors'` 옵션이 추가되어 있는지 확인
- Apps Script 배포 시 "모든 사용자" 액세스 권한 확인

### 데이터가 저장되지 않음
- Apps Script 실행 로그 확인:
  1. Apps Script 에디터 → 상단 "실행" → "doPost"
  2. 하단 "실행 로그" 확인
- 스프레드시트 ID가 정확한지 확인

### 권한 오류
- Apps Script 배포 시 권한 승인을 다시 진행
- "나" 계정으로 실행되도록 설정 확인

---

## 6. 구글 시트 구조

배포 후 자동으로 생성되는 시트 구조:

| 제출일시 | 회사명 | 담당자명 | 이메일 | 연락처 | 업종 | 월 마케팅 예산 | 문의 내용 |
|---------|--------|---------|--------|--------|------|---------------|----------|
| 2024-01-15 14:30:22 | ABC마케팅 | 홍길동 | hong@abc.com | 010-1234-5678 | 이커머스 | 300-500만원 | 마케팅 자동화 문의 |

---

## 7. 보안 권장사항

1. **환경 변수 사용**: `.env.local` 파일은 Git에 커밋하지 마세요
2. **HTTPS 사용**: 프로덕션에서는 반드시 HTTPS 사용
3. **데이터 유효성 검사**: Apps Script에서 추가 검증 로직 구현
4. **스팸 방지**: reCAPTCHA 또는 rate limiting 추가 고려

---

## 다음 단계

✅ Google Apps Script 코드 배포 완료
✅ 웹 앱 URL 복사
✅ Next.js 앱에 환경 변수 추가
✅ handleSubmit 함수 수정
✅ 테스트 및 확인

성공적으로 연동되면 모든 리드 데이터가 구글 시트에 자동으로 저장됩니다!
