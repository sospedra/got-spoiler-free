const {
  addHours,
  isAfter,
  isMonday,
  isTuesday,
  startOfDay,
} = require('date-fns')

module.exports = function guard (now) {
  const limit = addHours(startOfDay(now), 3)

  if (isMonday(now) && isAfter(now, limit)) return true
  if (isTuesday(now) && isAfter(limit, now)) return true

  return false
}
