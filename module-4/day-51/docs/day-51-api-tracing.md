# Day 51 — API Tracing and Documentation

**Project:** Addis Eats  
**Module:** 3 — Next.js  
**Exercise:** Trace and Document a Real API  
**Day:** 51

## 1. Objective

The purpose of this exercise is to understand how APIs communicate between a client and a server by inspecting real HTTP requests using the browser Network tab.

## 2. five Real API Requests

| No. | Method | Full Path | Status Code | Request Body |
|---|---|---|---|---|
| 1 | [GET] | [http://localhost:3000/._.js] | [200] | [Yes] |
| 2 | [GET] | [http://localhost:3000/api/me] | [200] | [Yes] |
| 3 | [GET] | [http://localhost:3000/?] | [200] | [Yes] |
| 4 | [GET] | [http://localhost...._.js] | [304] | [No] |
| 5 | [GET] | [http://localhost:3000/signin?_rsc] | [200] | [Yes] |

## 3. Request and Response Headers

### Request 1: `/me`

**Request Headers**

| Header | Purpose |
|---|---|
| Accept | Specifies accepted response formats |
| Cookie | Sends stored browser cookies |
| User-Agent |Identifies the browser making the request |

**Response Headers**

| Header |  Purpose |
|---|---|
| Content-Type | Specifies the response data format |
| Cache-Control |  Controls response caching |
| Date |  Indicates the response date |

### Request 2: `/checkout`

**Request Headers**

| Header |Purpose |
|---|---|
| Accept | Specifies accepted response formats |
| Cookie |  Sends stored browser cookies |
| User-Agent | Identifies the browser making the request |

**Response Headers**

| Header |  Purpose |
|---|---|
| Content-Type | Specifies the response data format |
| Cache-Control |  Controls response caching |
| Date | Indicates the response date |

### Header Explanation

- **Accept:** Tells the server which response formats the browser can accept.
- **Cookie:** Sends stored session or other browser cookies when applicable.
- **User-Agent:** Identifies the browser and its environment.
- **Content-Type:** Describes the format of the response.
- **Cache-Control:** Defines caching instructions.
- **Date:** Shows when the response was generated.

## 4. Failing Request

**Method:** GET

**Path:** `/api/day51-test-not-found`

**Expected Status:** 404 Not Found

**Actual Status:** [Record from browser]

**Was the status correct?**

A 404 response is appropriate when the requested resource does not exist. It informs the client that the server could not find the requested resource.

## 5. Addis Eats API Endpoint Design

The following table describes six proposed API endpoints for the Addis Eats application.

| Method | Path | Purpose | Expected Success |
|---|---|---|---|
| GET | /api/dishes | Retrieve all dishes | 200 OK |
| GET | /api/dishes/:id | Retrieve one dish | 200 OK |
| GET | /api/categories | Retrieve dish categories | 200 OK |
| POST | /api/orders | Create a customer order | 201 Created |
| GET | /api/orders | Retrieve customer orders | 200 OK |
| PATCH | /api/orders/:id/status | Update order status | 200 OK |

## 6. HTTP Status Code Understanding

- 200 OK — Request completed successfully.
- 201 Created — A new resource was successfully created.
- 204 No Content — Request succeeded without a response body.
- 400 Bad Request — Request contains invalid data.
- 401 Unauthorized — Authentication is required.
- 403 Forbidden — User does not have permission.
- 404 Not Found — Requested resource does not exist.
- 500 Internal Server Error — Unexpected server-side error.

### 200 versus 201

For a request that retrieves information, 200 OK is appropriate.

For a request that creates a new order, 201 Created is more appropriate because a new resource has been created.

## 7. Conclusion

This exercise helped me understand HTTP methods, request and response headers, status codes, and API endpoint design.

Using the browser Network tab makes it easier to understand how frontend applications communicate with backend services.

**Project:** Addis Eats  
**Day 51:** Completed after filling in actual browser observations.