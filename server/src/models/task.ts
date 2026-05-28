import { Schema } from 'mongoose';
import { model } from 'mongoose';

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

taskSchema.index(
  { title: 'text', content: 'text' },
  {
    name: 'TaskSearchIndex',
    weights: { title: 10, content: 5 },
    default_language: 'english',
  },
);

export const Task = model('Task', taskSchema);
