/**
 * Created by lykovartem on 2/27/2017.
 */

// define model =================
let TaskModel = mongoose.model('TaskModel', {
    name: String,
    description: String,
    hours: Number,
    taskState: String,
    id: Number,
    createTime: Date,
});