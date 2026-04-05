# Library Management System Testing Project
## Option 3: User Experience and End-to-End Testing

โครงงานนี้เป็นส่วนหนึ่งของรายวิชา **Software Testing and Evaluation**  
โดยมุ่งเน้นการทดสอบระบบ **Library Management System** ในด้าน **UI/UX, End-to-End Testing, Cross-browser Testing, Exploratory Testing และ Test Automation ด้วย Playwright**

---

## Project Overview

โครงงานนี้จัดทำขึ้นเพื่อประเมินคุณภาพของระบบ Library Management System จากมุมมองของผู้ใช้งานจริง โดยเน้นการทดสอบเส้นทางการใช้งานหลัก (User Journey) และการตรวจสอบปัญหาด้าน usability, validation, permission handling และ browser compatibility

---

## Objectives

- ออกแบบและจัดทำ **40 End-to-End Test Cases**
- พัฒนา **38 Playwright Automated Tests**
- ทดสอบระบบแบบ **Cross-browser** บน Chromium, Firefox และ WebKit
- จัดทำ **Exploratory Testing Report**
- รวบรวมและจัดกลุ่ม **Bug Reports 20 รายการ**
- สรุป **Usability Metrics**
- จัดทำ **Test Automation Framework Guide**

---

## Scope of Testing

ครอบคลุมการทดสอบฟังก์ชันหลักของระบบดังนี้:

- Authentication (Login / Logout)
- Dashboard Navigation
- Books Management
- Members Management
- Borrowing / Return
- Reports
- Permission handling ของ Admin / Librarian
- Validation and Feedback behavior
- Cross-browser compatibility

---

## Test Deliverables

โครงงานนี้ประกอบด้วย deliverables ดังต่อไปนี้:

- Test Plan (User Journey Focused)
- Test Cases (40 End-to-End Scenarios)
- Playwright Automation Tests (38 tests)
- Cross-browser Testing Report
- Visual Regression Test Plan
- Exploratory Testing Report
- Bug Reports (20 bugs grouped by feature)
- Usability Metrics
- Test Automation Framework Guide

---

## Test Results Summary

### Playwright Automation
- Total Authored Tests: **38**
- Modules: **6**
  - Authentication
  - Dashboard
  - Books
  - Members
  - Borrowing
  - Reports

### Cross-browser Execution Summary
| Browser | Total | Passed | Failed | Did not run | Pass Rate |
|--------|------:|-------:|-------:|------------:|----------:|
| Chromium | 38 | 23 | 3 | 12 | 60.5% |
| Firefox | 38 | 12 | 7 | 19 | 31.6% |
| WebKit | 38 | 23 | 3 | 12 | 60.5% |
| **Total** | **114** | **58** | **13** | **43** | **50.9%** |

### Bug Summary
- Total Bugs Found: **20**
- Main categories:
  - Authentication
  - Dashboard / Navigation
  - Books
  - Borrowing
  - Reports
  - Members

---

## Tools and Technologies

- **Node.js**
- **Express**
- **SQLite**
- **Playwright**
- **GitHub Issues**
- **Markdown / Word / PDF**

---

## Project Structure

```bash
Library-Management-System/
├── playwright/
│   ├── tests/
│   ├── helpers/
│   ├── fixtures/
│   └── snapshots/
├── test-cases/
├── bug-reports/
├── reports/
├── public/
├── src/
├── views/
├── package.json
├── playwright.config.js
└── README.md
