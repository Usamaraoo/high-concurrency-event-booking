-- KEYS[1] = event seat counter
-- KEYS[2] = reservation key (now: reservation:eventId:seats:uuid)
-- ARGV[1] = requestedSeats
-- ARGV[2] = ttlSeconds

local available = tonumber(redis.call("GET", KEYS[1]))
local requested = tonumber(ARGV[1])

if not available then return redis.error_reply("EVENT_NOT_CACHED") end
if available < requested then return redis.error_reply("INSUFFICIENT_SEATS") end

-- Decrement counter
redis.call("DECRBY", KEYS[1], requested)

-- Create the expiration key
-- We don't need HSET because the info is in the key name KEYS[2]
redis.call("SET", KEYS[2], "active") 
redis.call("EXPIRE", KEYS[2], tonumber(ARGV[2]))

return { "OK", tostring(requested), tostring(available - requested) }