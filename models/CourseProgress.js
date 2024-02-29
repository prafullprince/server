const mongoose = require("mongoose");

const userCourseProgressSchema = new mongoose.Schema({
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    },
    completedVideo:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubSection",
    }]
});
module.exports = mongoose.model("CourseProgress",userCourseProgressSchema);