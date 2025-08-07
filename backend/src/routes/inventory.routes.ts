import { Router } from 'express';

const router = Router();

// Inventory routes will be implemented here
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Inventory routes endpoint',
    data: { available: false }
  });
});

export default router;
