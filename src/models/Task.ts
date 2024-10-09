import mongoose, {Schema, Document}  from "mongoose";

export interface Itask extends Document  {
    name: string,
    description: string
}

export const TaskSchema : Schema =  new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    }
  });

  const Project = mongoose.model<Itask>('Task', TaskSchema)
  export default Project