import CustomRouter from '../routes/custom/custom.router.js';
import { 
    createCartController, 
    getCartByIdController, 
    updateCartController, 
    addProductToCartController, 
    removeProductFromCartController, 
    deleteWholeCartController, 
    purchaseCartController,
    getCartByUserIdController 
} from '../controllers/carts.controller.js';
import {ownerShipMiddleware}  from '../middlewares/ownership.middleware.js';


const router = new CustomRouter();

router.post('/', ['USER', 'PREMIUM', 'ADMIN'], createCartController);

router.get('/:cid', [ ownerShipMiddleware,'USER', 'PREMIUM', 'ADMIN'], getCartByIdController);

router.put('/:cid', ['USER'], updateCartController);

router.post('/:cid/products/:pid', ['USER'], addProductToCartController);

router.delete('/:cid/products/:pid', ['PREMIUM', 'ADMIN'], removeProductFromCartController);

router.delete('/:cid', ['PREMIUM', 'ADMIN'], deleteWholeCartController);

router.post('/:cid/purchase', ['USER', 'PREMIUM', 'ADMIN'], purchaseCartController);

router.get('/cart/:cid', ['USER', 'PREMIUM', 'ADMIN'], getCartByUserIdController);


export default router.getRouter();
