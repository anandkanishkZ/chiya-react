import { Router } from 'express';

const router = Router();

// Menu routes will be implemented here
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Menu routes endpoint',
    data: { available: false }
  });
});

export default router;
