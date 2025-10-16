import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    dependsOn: [{ type: Number }], // indices of tasks this depends on
    startDate: { type: Date },
    endDate: { type: Date },
    estimatedDays: { type: Number },
  },
  { _id: false }
);

const PlanSchema = new mongoose.Schema(
  {
    goal: { type: String, required: true },
    horizonDays: { type: Number, default: 14 },
    tasks: { type: [TaskSchema], default: [] },
    llmModel: { type: String, default: 'gemini-1.5-pro' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Plan = mongoose.model('Plan', PlanSchema);


