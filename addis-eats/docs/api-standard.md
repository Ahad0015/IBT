### Error response shape

Every error, with every status code, has exactly five fields:

| Field | Type | Meaning |
|---|---|---|
| statusCode | number | The HTTP status code, repeated in the body |
| message | string[] | One or more messages a customer can act on. Always an array. |
| path | string | The URL the client called |
| timestamp | string | ISO 8601 time when the error was produced |
| requestId | string | Unique id; also in the `x-request-id` response header; quote it to support |

Rules:
- No stack trace and no internal class names appear at any status.
- An unexpected server error returns 500 with a generic message.
- Domain rules use: 404 existence, 409 state conflict (including an invalid status transition), 422 relationship or business rule.