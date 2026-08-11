# Security Specification - Bakman & Sylvan Property Ops

## Data Invariants
1. A property record (`properties/{propertyId}`) must contain `sections`, `transcripts`, `lastUpdated`, `updatedBy`, and `timestamp`.
2. `sections` is an array of objects. Each section has `id`, `title`, `icon`, `tag`, and `tasks`.
3. `transcripts` is an array of objects with `date` and `text`.
4. Only authenticated users (even anonymous ones for this shared board) can read and write the specific property document.

## The Dirty Dozen Payloads (Targeting `/properties/bakman-sylvan-mgmt`)

1. **Junk Field Injection**: Adding `isAdmin: true` to the property state.
2. **Identity Spoofing**: Setting `updatedBy` to another user's UID.
3. **Massive Data Bloat**: Sending a `lastUpdated` string that is 1MB in size.
4. **Invalid Type**: Sending `sections` as a string instead of an array.
5. **Orphaned Writes**: Updating `timestamp` to a future date manually from client.
6. **Malicious ID**: Creating a property with a 1KB ID containing special characters.
7. **Read Scraping**: Attempting to list all properties (if they existed).
8. **State Hammering**: Frequency of updates (rate limiting - usually handled by Firebase limits but rules can help).
9. **Missing Fields**: Creating a property without a `timestamp`.
10. **Immutability Breach**: (N/A for this app as it's a single shared state, but we could make `createdAt` immutable if we had it).
11. **JSON String Injection**: Trying to store a JSON string in a field that should be a Map.
12. **Unauthorized Update**: Modifying a property ID that doesn't match the allowed partnership ID.

## Test Cases
- [ ] Deny creation of properties other than `bakman-sylvan-mgmt` (unless explicitly allowed).
- [ ] Deny update if `timestamp` is not set to `request.time`.
- [ ] Deny update if `updatedBy` does not match `request.auth.uid`.
- [ ] Deny write if sections array is missing.
- [ ] Deny read if not signed in.
