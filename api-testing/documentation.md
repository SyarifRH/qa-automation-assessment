# API Testing Documentation - JSONPlaceholder

## 📋 Test Overview

**Platform**: JSONPlaceholder REST API  
**Base URL**: https://jsonplaceholder.typicode.com  
**Test Date**: ${new Date().toLocaleDateString()}  
**Total Test Cases**: 12 (6 Positive, 6 Negative)  
**Testing Tool**: JavaScript + Axios

## 🤖 AI Tools Usage

### Deepsek

- **Generated** initial test case structure for both positive and negative scenarios
- **Suggested** assertion patterns for response validation
- **Helped** with error handling strategies for negative test cases

## ✅ Positive Test Cases (Expected to Pass)

| #   | Test Case         | Endpoint              | Expected Result                | Actual Result                | Status |
| --- | ----------------- | --------------------- | ------------------------------ | ---------------------------- | ------ |
| 1   | GET Existing Post | GET /posts/1          | Status 200, post with ID=1     | ✅ Status 200, ID=1          | PASS   |
| 2   | GET All Posts     | GET /posts            | Status 200, array of 100 posts | ✅ Status 200, 100 posts     | PASS   |
| 3   | Create New Post   | POST /posts           | Status 201, new post with ID   | ✅ Status 201, new ID        | PASS   |
| 4   | Update Post       | PUT /posts/1          | Status 200, updated title      | ✅ Status 200, title updated | PASS   |
| 5   | Delete Post       | DELETE /posts/1       | Status 200, delete successful  | ✅ Status 200                | PASS   |
| 6   | Get Post Comments | GET /posts/1/comments | Status 200, array of comments  | ✅ Status 200, 5 comments    | PASS   |

## ❌ Negative Test Cases (Error Handling)

| #   | Test Case             | Endpoint         | Expected Result               | Actual Result                       | Status |
| --- | --------------------- | ---------------- | ----------------------------- | ----------------------------------- | ------ |
| 7   | GET Non-existent Post | GET /posts/99999 | Status 404 Not Found          | ✅ Status 404                       | PASS   |
| 8   | POST Empty Data       | POST /posts      | Status 400 Bad Request        | ⚠️ Status 201 (Mock API limitation) | PASS\* |
| 9   | POST Invalid Data     | POST /posts      | Status 400 Validation Error   | ⚠️ Status 201 (Mock API limitation) | PASS\* |
| 10  | GET Invalid Endpoint  | GET /invalid-url | Status 404 Not Found          | ✅ Status 404                       | PASS   |
| 11  | PUT No Data           | PUT /posts/1     | Status 400 Bad Request        | ⚠️ Status 200 (Mock API limitation) | PASS\* |
| 12  | PATCH Unsupported     | PATCH /posts/1   | Status 405 Method Not Allowed | ⚠️ Status 200 (Mock API limitation) | PASS\* |

_\*Note: JSONPlaceholder is a mock API that doesn't implement full validation. These tests document the expected behavior vs actual mock API behavior._

## 📊 Test Results Summary
