import { Router } from 'express';

const router = Router();

// Restaurant routes will be implemented here
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Restaurant routes endpoint',
    data: { available: false }
  });
});

export default router;
