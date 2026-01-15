// Google Apps Script - 구글 시트에 리드 데이터 저장
// 스프레드시트 ID: 1AnB3ogO3JXggy39OTYKsLtWfmEva68OjjdqGh9EnLxk

function doPost(e) {
  try {
    // 스프레드시트 열기
    const spreadsheet = SpreadsheetApp.openById('1AnB3ogO3JXggy39OTYKsLtWfmEva68OjjdqGh9EnLxk');
    const sheet = spreadsheet.getSheetByName('리드데이터') || spreadsheet.getSheets()[0];

    // 요청 데이터 파싱
    const data = JSON.parse(e.postData.contents);

    // 현재 시간 (한국 시간)
    const timestamp = new Date();
    const kstTime = Utilities.formatDate(timestamp, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');

    // 헤더가 없으면 추가
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        '제출일시',
        '회사명',
        '담당자명',
        '이메일',
        '연락처',
        '업종',
        '월 마케팅 예산',
        '문의 내용'
      ]);

      // 헤더 스타일 설정
      const headerRange = sheet.getRange(1, 1, 1, 8);
      headerRange.setBackground('#3b82f6');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
    }

    // 데이터 추가
    sheet.appendRow([
      kstTime,
      data.company || '',
      data.name || '',
      data.email || '',
      data.phone || '',
      data.industry || '',
      data.budget || '',
      data.message || ''
    ]);

    // 방금 추가된 행에 자동 서식 적용
    const lastRow = sheet.getLastRow();
    const dataRange = sheet.getRange(lastRow, 1, 1, 8);
    dataRange.setBorder(true, true, true, true, false, false);

    // 짝수/홀수 행 구분
    if (lastRow % 2 === 0) {
      dataRange.setBackground('#f8fafc');
    }

    // 열 너비 자동 조정
    sheet.autoResizeColumns(1, 8);

    // 성공 응답
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: '데이터가 성공적으로 저장되었습니다.',
        row: lastRow
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // 에러 응답
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: '오류가 발생했습니다: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET 요청 처리 (테스트용)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: '리드 수집 API가 정상 작동 중입니다.',
      spreadsheetId: '1AnB3ogO3JXggy39OTYKsLtWfmEva68OjjdqGh9EnLxk'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// 이메일 알림 함수 (선택사항)
function sendEmailNotification(data) {
  const recipient = 'your-email@example.com'; // 알림 받을 이메일 주소
  const subject = '[신규 리드] ' + data.company + ' - ' + data.name;
  const body = `
신규 리드가 접수되었습니다.

회사명: ${data.company}
담당자명: ${data.name}
이메일: ${data.email}
연락처: ${data.phone}
업종: ${data.industry}
월 마케팅 예산: ${data.budget}
문의 내용: ${data.message}

확인하려면 구글 시트를 방문하세요:
https://docs.google.com/spreadsheets/d/1AnB3ogO3JXggy39OTYKsLtWfmEva68OjjdqGh9EnLxk/edit
  `;

  MailApp.sendEmail(recipient, subject, body);
}

// 이메일 알림을 활성화하려면 doPost 함수에서 sheet.appendRow() 이후에 아래 코드 추가:
// sendEmailNotification(data);
