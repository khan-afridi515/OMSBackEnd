const Leave = require('../model/leave');
const Attandance = require('../model/attandance');


exports.applyLeave = async (req, res) => {
    try {
        const userId = req.user.id;
        const { leaveType, startDate, endDate, reason } = req.body;

        // 1. Required Fields Validation
        if (!leaveType || !startDate || !endDate || !reason) {
            return res.status(400).json({
                msg: "All fields are required"
            });
        }

        // 2. Validate Leave Type
        const validTypes = ["Casual", "Sick", "Emergency"];
        if (!validTypes.includes(leaveType)) {
            return res.status(400).json({
                msg: "Invalid leave type"
            });
        }

        // Convert to Date
        const start = new Date(startDate);
        const end = new Date(endDate);

        // 3. End date cannot be before start date
        if (end < start) {
            return res.status(400).json({
                msg: "End date cannot be before start date"
            });
        }

        // 4. Normalize dates (important)
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        // 5. Check overlapping leave
        const overlappingLeave = await Leave.findOne({
            userId,
            $or: [
                {
                    startDate: { $lte: end },
                    endDate: { $gte: start }
                }
            ]
        });

        if (overlappingLeave) {
            return res.status(400).json({
                msg: "Leave request overlaps with existing leave"
            });
        }

        //6. Create Leave
        const leave = await Leave.create({
            userId,
            leaveType,
            startDate: start,
            endDate: end,
            reason,
            status: "Pending"

        });

        return res.status(200).json({
            msg: "Leave applied successfully",
            leave
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "Internal server error"
        });
    }
};

exports.getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find().populate('userId', 'name email');
        if(leaves.length === 0){
            return res.status(404).json({msg: "No leaves applied "});
        }
        return res.status(200).json({msg: "All leaves fetched successfully", leaves});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({msg: "Internal server error"});
    }
}


exports.getAllUsersleaves = async (req, res)=>{
    try{
        const userId = req.user.id;

        if(!userId){
            return res.status(400).json({msg: "User Id is required"});
        }

        const allLeaves = await Leave.find();
        if(!allLeaves){
            return res.status(404).json({msg: "No leaves founds"});
        }

        return res.status(200).json({msg: "All leaves fetched successfully", allLeaves});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({msg: "Internal server error", erro: err.message});
    }
}

// approve leave for admin.
exports.approveLeave = async (req, res) => {
    try {
      const { leaveId } = req.params;
  
      const leave = await Leave.findById(leaveId);
  
      if (!leave) {
        return res.status(404).json({ msg: "Leave not found" });
      }
  
      // if (leave.status !== "Pending") {
      //   return res.status(400).json({
      //     msg: `Leave already ${leave.status}`
      //   });
      // }
  
      // ✅ Approve leave
      leave.status = "Approved";
      await leave.save();
  
      // 🔥 Normalize start & end dates
      let currentDate = new Date(leave.startDate);
      currentDate.setHours(0, 0, 0, 0);
  
      const endDate = new Date(leave.endDate);
      endDate.setHours(0, 0, 0, 0);
  
      // 🔥 Loop through ALL days (inclusive)
      while (currentDate <= endDate) {
  
        const startOfDay = new Date(currentDate);
        startOfDay.setHours(0, 0, 0, 0);
  
        const endOfDay = new Date(currentDate);
        endOfDay.setHours(23, 59, 59, 999);
  
        // ✅ Check if already exists
        const exists = await Attandance.findOne({
          userId: leave.userId,
          date: { $gte: startOfDay, $lte: endOfDay }
        });
  
        // ✅ Create only if not exists
        if (!exists) {
          await Attandance.create({
            userId: leave.userId,
            date: new Date(currentDate),
            status: "leave"
          });
        }
  
        // 👉 Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
  
      return res.status(200).json({
        msg: "Leave approved and all days marked as leave",
        leave
      });
  
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };