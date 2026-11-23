// One error shape for every endpoint:
//   { "error": "message", "fieldErrors": { field: ["message"] } }   (fieldErrors optional)
// Never return 200 with { ok: false } buried inside.
export function fail(message, status, fieldErrors) {
  return Response.json(
    { error: message, ...(fieldErrors ? { fieldErrors } : {}) },
    { status }
  );
}
