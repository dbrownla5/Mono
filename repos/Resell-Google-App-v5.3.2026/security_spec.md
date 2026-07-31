# security_spec.md

1. Data Invariants: An item needs brand, model, marketPrice, floorPrice, platform, status, ownerId, createdAt. ownerId Must match request.auth.uid.
2. The "Dirty Dozen" Payloads:
   - Payload 1: Create item with ownerId != request.auth.uid (Should fail)
   - Payload 2: Create item with missing fields (Should fail)
   - Payload 3: Create item with invalid types (Should fail)
   - Payload 4: Update item with changed ownerId (Should fail)
   - Payload 5: Update item with changed createdAt (Should fail)
   - Payload 6: Access item belonging to another user (Should fail)
   - Payload 7: List items belonging to other users (Should fail)
   - ... and so on for all variants ...
3. Audit:
   - Identity Spoofing: Check if I can set ownerId to someone else. (Rule: Prevented by isValidItem)
   - State Shortcutting: ...
   - Resource Poisoning: Check if I can inject massive string into ID. (Need isValidId)
   - Value Poisoning: (Need strict isValidItem)
