const TimeSlot = require("../models/timeslot");

function isOverlapping(range1, range2) {
  const [start1, end1] = range1
    .split("-")
    .map((time) => new Date(`1970-01-01T${time}:00`));
  const [start2, end2] = range2
    .split("-")
    .map((time) => new Date(`1970-01-01T${time}:00`));

  return (
    (start1 >= start2 && start1 < end2) || (start2 >= start1 && start2 < end1)
  );
}

async function isTimeSlotOverlapping(newSlot) {
  const allSlots = await TimeSlot.find({ ownerID: newSlot.owner });

  for (const slot of allSlots) {
    if (
      slot.frequency === newSlot.frequency &&
      isOverlapping(slot.timestamp, newSlot.timestamp)
    ) {
      return true;
    }
  }
  return false;
}

module.exports = { isTimeSlotOverlapping };