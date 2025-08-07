import { Router } from 'express';

const router = Router();

// Expense routes will be implemented here
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Expense routes endpoint',
    data: { available: false }
  });
});

export default router;
