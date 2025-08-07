import { Router } from 'express';

const router = Router();

// Staff routes will be implemented here
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Staff routes endpoint',
    data: { available: false }
  });
});

export default router;
