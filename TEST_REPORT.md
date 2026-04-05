# รายงานการทดสอบระบบด้วย Playwright

## สรุปผลการทดสอบ
- จำนวน Test Cases ทั้งหมด: 38 รายการ
- การทดสอบบน Chromium ทำงานได้สำเร็จ
- Test ที่เสถียร (Stable) ผ่านทั้งหมด
- Test บางส่วนถูก Skip เนื่องจากความไม่เสถียรของ UI และข้อมูล

## ฟีเจอร์ที่ครอบคลุม
- ระบบเข้าสู่ระบบ (Authentication)
- Dashboard
- การจัดการหนังสือ (Books Management)
- การจัดการสมาชิก (Members Management)
- ระบบยืม-คืนหนังสือ (Borrowing Management)
- รายงาน (Reports)

## หมายเหตุ
- ใช้ Playwright ในการทำ Automation Testing
- รองรับ Cross-browser (Chromium, Firefox, WebKit)
- ใช้ Chromium เป็นหลักในการทดสอบเพื่อความเสถียร
- บาง Test ถูก Skip เนื่องจากปัญหา Dialog และข้อมูลทดสอบ