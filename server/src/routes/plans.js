import { Router } from 'express';
import { z } from 'zod';
import { Plan } from '../models/Plan.js';
import { generatePlanWithGemini } from '../services/gemini.js';
import { scheduleSequential } from '../utils/timeline.js';

const router = Router();

const GenerateSchema = z.object({
  goal: z.string().min(5),
  horizonDays: z.number().int().min(1).max(365).optional().default(14),
  startDate: z.string().datetime().optional(),
});

router.post('/generate', async (req, res) => {
  try {
    const { goal, horizonDays, startDate } = GenerateSchema.parse(req.body);

    let tasks = [];
    let aiGenerated = false;
    
    try {
      console.log(`Generating plan for goal: "${goal}"`);
      tasks = await generatePlanWithGemini(goal);
      aiGenerated = true;
      console.log(`Generated ${tasks.length} tasks using AI`);
    } catch (e) {
      console.warn('AI generation failed, using fallback plan:', e.message);
      // fallback minimal plan
      tasks = [
        { title: 'Understand the goal', description: 'Clarify scope and constraints', dependsOn: [] },
        { title: 'Draft plan', description: 'Create task breakdown with timeline', dependsOn: [0] },
        { title: 'Execute tasks', description: 'Carry out the plan', dependsOn: [1] },
      ];
    }

    // Validate and clean tasks
    const validatedTasks = tasks.map((task, index) => ({
      title: task.title || `Task ${index + 1}`,
      description: task.description || '',
      dependsOn: Array.isArray(task.dependsOn) ? task.dependsOn.filter(dep => 
        typeof dep === 'number' && dep >= 0 && dep < tasks.length
      ) : [],
    }));

    const scheduled = scheduleSequential(startDate ? new Date(startDate) : new Date(), validatedTasks, horizonDays).map((t) => ({
      title: t.title,
      description: t.description,
      dependsOn: t.dependsOn,
      startDate: t.startDate,
      endDate: t.endDate,
      estimatedDays: Math.max(1, Math.ceil(((t.endDate - t.startDate) / (1000 * 60 * 60 * 24)) || 1)),
    }));

    const plan = await Plan.create({ 
      goal, 
      horizonDays, 
      tasks: scheduled,
      llmModel: aiGenerated ? 'gemini-1.5-pro' : 'fallback'
    });
    
    res.json({ ...plan.toObject(), aiGenerated });
  } catch (err) {
    console.error('Error generating plan:', err);
    if (err.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Invalid input data', 
        details: err.errors 
      });
    }
    res.status(500).json({ error: 'Failed to generate plan. Please try again.' });
  }
});

router.get('/', async (_req, res) => {
  try {
    const plans = await Plan.find().sort({ createdAt: -1 }).limit(50);
    res.json(plans);
  } catch (err) {
    console.error('Error fetching plans:', err);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    console.error('Error fetching plan:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid plan ID' });
    }
    res.status(500).json({ error: 'Failed to fetch plan' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    console.error('Error updating plan:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid plan ID' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Invalid plan data', details: err.errors });
    }
    res.status(500).json({ error: 'Failed to update plan' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    res.json({ success: true, message: 'Plan deleted successfully' });
  } catch (err) {
    console.error('Error deleting plan:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid plan ID' });
    }
    res.status(500).json({ error: 'Failed to delete plan' });
  }
});

export default router;


