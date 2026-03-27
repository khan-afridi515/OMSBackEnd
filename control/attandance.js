const attandance = require("../model/attandance");
const Attandance = require("../model/attandance");


// exports.markattandance = async(req, res) => {
//      try{
//         const userId = req.user.id;
//         const currentDate = new Date();
//         // logic to mark attendance for the user

//         const startOfDay = new Date(currentDate);
//         startOfDay.setHours(0, 0, 0, 0);

//         // End of today
//         const endOfDay = new Date(currentDate);
//         endOfDay.setHours(23, 59, 59, 999);

//         // Check if already marked today
//         const allreadyMarked = await Attandance.findOne({
//             userId,
//             date: { $gte: startOfDay, $lte: endOfDay }
//         });
        
//         if(allreadyMarked){
//             return res.status(400).json({msg:"Attandance already marked for today"})
//         }

//         const newAttandance = await Attandance.create({userId, date:currentDate, status:"present"});
//         if(!newAttandance) return res.status(400).json({wrn:"Failed to mark attandance"})

//         return res.status(200).json({msg:"Attandance marked successfully", attandance:newAttandance})
//      }
//      catch(err){
//         console.log(err);
//         return res.status(500).json({msg:"Internal server error"})
//      }
// }


// user all attandance


exports.markattandance = async (req, res) => {
    try {
      const userId = req.user.id;
      const currentDate = new Date();
  
      // Get current hours & minutes
      const currentHours = currentDate.getHours();
      const currentMinutes = currentDate.getMinutes();
  
      // Convert current time to minutes (easy comparison)
      const currentTimeInMinutes = currentHours * 60 + currentMinutes;
  
      // Define allowed time (09:00 AM → 05:00 PM)
      const startTime = 9 * 60;   // 09:00 AM
      const endTime = 17 * 60;    // 05:00 PM
  
      // Check if current time is outside allowed range
      if (currentTimeInMinutes < startTime || currentTimeInMinutes > endTime) {
        return res.status(400).json({
          msg: "Attendance can only be marked between 09:00 AM and 05:00 PM"
        });
      }
  
      // Start of today
      const startOfDay = new Date(currentDate);
      startOfDay.setHours(0, 0, 0, 0);
  
      // End of today
      const endOfDay = new Date(currentDate);
      endOfDay.setHours(23, 59, 59, 999);
  
      // Check if already marked today
      const allreadyMarked = await Attandance.findOne({
        userId,
        date: { $gte: startOfDay, $lte: endOfDay }
      });
  
      if (allreadyMarked) {
        return res.status(400).json({
          msg: "Attendance already marked for today"
        });
      }
  
      // Create attendance
      const newAttandance = await Attandance.create({
        userId,
        date: currentDate,
        status: "present"
      });
  
      return res.status(200).json({
        msg: "Attendance marked successfully",
        attandance: newAttandance
      });
  
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };

exports.userAttandance = async(req, res) => {
    try{
        const userId = req.user.id;
        console.log(userId);
        const attandanceList = await Attandance.find({userId});
        console.log("attandanceList", attandanceList);
        if(attandanceList.length === 0){
            return res.status(400).json({wrn:"No attandance found for the user"});
        }else{
            return res.status(200).json({msg:"Attandance list fetched successfully", attandance:attandanceList});
        }
        
    }
    catch(err){
        console.log(err);
        return res.status(500).json({msg:"Internal server error"})
    }
}


// all users attandance for admin

exports.allUserAttandance = async(req, res) => {
    try{
        const allattandancelist = await Attandance.find();
        if(!allattandancelist) return res.status(400).json({wrn:"No attandance found"})

        return res.status(200).json({msg:"All users attandance list fetched successfully", attandance:allattandancelist});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({msg:"Internal server error"})
    }
}


