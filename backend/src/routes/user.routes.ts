import { Router } from 'express';

const router = Router();

// User routes will be implemented here
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'User routes endpoint',
    data: { available: false }
  });
});

export default router;
