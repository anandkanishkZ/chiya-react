import { Router } from 'express';

const router = Router();

// Order routes will be implemented here
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Order routes endpoint',
    data: { available: false }
  });
});

export default router;
