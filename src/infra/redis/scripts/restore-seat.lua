-- KEYS[1] = event seat counter (e.g., event:available_seats:123)
-- ARGV[1] = number of seats to restore

local counterKey = KEYS[1]
local amount = tonumber(ARGV[1])

-- Safety Check: If amount is nil or key is missing, don't run redis.call
if not counterKey or not amount then
    return redis.error_reply("LUA_ERR: Missing Key or Amount. Amount was: " .. tostring(ARGV[1]))
end

-- Line 4: This is likely where it crashed. 
-- We ensure counterKey and amount are NOT nil before calling this.
local result = redis.call("INCRBY", counterKey, amount)
return result