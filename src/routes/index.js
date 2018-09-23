import express from 'express';
import validator from '../middlewares/validator';
import OrderController from '../controllers/OrderController';
import UserController from '../controllers/UserController';

const router = express.Router();

router.post('/auth/signup', validator, UserController.signUp);
router.post('/orders', validator, OrderController.makeOrder);
router.get('/orders', OrderController.getOrders);
router.get('/orders/:id', OrderController.getOrders);
router.put('/orders/:id', OrderController.updateOrder);

export default router;
