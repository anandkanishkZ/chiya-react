import { Router } from 'express';

const router = Router();

// Report routes will be implemented here
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Report routes endpoint',
    data: { available: false }
  });
});

export default router;
