import { Router } from 'express';

const router = Router();

// Table routes will be implemented here
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Table routes endpoint',
    data: { available: false }
  });
});

export default router;
