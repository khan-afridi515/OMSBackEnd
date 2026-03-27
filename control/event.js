const Attandance = require('../model/attandance');
const myEventSchema = require('../model/event');
const EventRegistration = require('../model/eventRegister');


exports.eventFunction = async(req, res)=>{
    const {title, eventDate, place} = req.body

    try{
        const alreadyEvent = await myEventSchema.findOne({title, eventDate})

    if(alreadyEvent) return res.status(401).json({wrn:"Already this event created"});

    const newEvent = await myEventSchema.create({title, eventDate, place});

    if(!newEvent) return res.status(400).json({wrn:"Event doesn't registered"})
    return res.status(201).json({msg:"Event successfully created!", myNewEvent:newEvent})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({wrn:"Internal server err", myErr:err})
    }

    
}



// update Event admin

exports.updateEvent = async(req, res)=>{
    const {eventId} = req.params;
    const {title, eventDate, place} = req.body;
    try{
        const findEvent = await myEventSchema.findById(eventId);

        if(!findEvent) res.status(401).json({wrn:"Event can't be find"})
        
        if(title) findEvent.title = title;
        if(eventDate) findEvent.eventDate = eventDate;
        if(place) findEvent.place = place;
        await findEvent.save();

        return res.status(200).json({msg:"Event updated successfully!", updatedEvent:findEvent});

    
    }
    catch(err){
        console.log(err)
        return res.status(500).json({eventErr:err})
    }
}


// get all Events admin/users

exports.getAllEvents = async(req, res) =>{

    try{
     
        const allEvents = await myEventSchema.find();

        if(!allEvents) return res.status(400).json({wrn:"Event can't be find"})
        return res.status(200).json({msg:"Events successfully finded", wholeEvents:allEvents})
    }
    catch(err){
        console.log(err)
    }

}

// delete events for admin
exports.deleteEvent = async(req, res) => {
    const {eventId} = req.params;
    try{

        const dltEvent = await myEventSchema.findByIdAndDelete(eventId);
        if(!dltEvent) return res.status(401).json({wrn:"Event can't be find and deleted"})
        return res.status(200).json({msg:"Event sucessfully deleted!"});

    }
    catch(err){
        console.log(err)
        return res.status(500).json({wrn:"Internal server err"}, err)
    }
}


exports.registerForEvent = async (req, res) => {
    try {
      const userId = req.user.id;
      const { eventId } = req.params;
  
      // Check event exists
      const event = await myEventSchema.findById(eventId);
      if (!event) {
        return res.status(404).json({ msg: "Event not found" });
      }
  
      const eventDate = new Date(event.eventDate);
  
      // Check already registered
      const alreadyRegistered = await EventRegistration.findOne({
        userId,
        eventId
      });
  
      if (alreadyRegistered) {
        return res.status(400).json({ msg: "Already registered for this event" });
      }
  
      // Register user
      const registration = await EventRegistration.create({
        userId,
        eventId,
        date: eventDate
      });
  
      // Check attendance for that date
      const existingAttendance = await Attandance.findOne({
        userId,
        date: eventDate
      });
  
      if (existingAttendance) {
        // Update status to Event
        existingAttendance.status = "Event";
        await existingAttendance.save();
      } else {
        // Create new attendance with Event status
        await Attandance.create({
          userId,
          date: eventDate,
          status: "Event"
        });
      }
  
      return res.status(200).json({
        msg: "Registered for event successfully",
        registration
      });
  
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error" });
    }
  };