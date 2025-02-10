import {
    UserController,
    ProductController,
    FincashController,
    PaymentController,
    SupplierController,
    ValidityController,
    SaleDetailController,
    CashOutflowController,
} from './../controllers';
import { Router } from 'express';
import { StockController } from '../controllers/Stock';
import { ProdGroupController } from '../controllers/ProductGroup';
import { ensureAuthenticated, ensureAdmin } from '../shared/middleware';

const router = Router();



// CREATE SUPER USER
router.get('/superuser', UserController.createSuperUser);



// PRODUCT
router.get('/product/per-stock', ensureAuthenticated, ProductController.getSectorStock);
router.get('/product/per-sector', ensureAuthenticated, ProductController.getSectorQuantity);
router.get('/product/per-stock-value', ensureAuthenticated, ProductController.getSectorStockValue);
router.get('/product/per-value', ensureAuthenticated, ensureAdmin, ProductController.getSectorValue);
router.get('/product', ensureAuthenticated, ProductController.getAllValidation, ProductController.getAll);
router.post('/product', ensureAuthenticated, ProductController.createValidation, ProductController.create);
router.get('/product/:id', ensureAuthenticated, ProductController.getByIdValidation, ProductController.getById);
router.get('/product/code/:code', ensureAuthenticated, ProductController.getByCode, ProductController.getByCode);
router.post('/product/output', ensureAuthenticated, ProductController.outputValidation, ProductController.output);
router.put('/product/:id', ensureAuthenticated, ProductController.updateByIdValidation, ProductController.updateById);
router.delete('/product/:id', ensureAuthenticated, ProductController.deleteByIdValidation, ProductController.deleteById);
router.get('/product-output/getall', ensureAuthenticated, ProductController.getOutputsValidation, ProductController.getOutputs);
router.get('/product-output/:id', ensureAuthenticated, ProductController.getOutputByIdValidation, ProductController.getOutputById);



// FINCASH
router.get('/fincash/last', ensureAuthenticated, FincashController.getLastFincash);
router.get('/fincash/verify', ensureAuthenticated, FincashController.getByFinished);
router.get('/data/month/current', ensureAuthenticated, ensureAdmin, FincashController.getCurrentMonth);
router.get('/fincash', ensureAuthenticated, FincashController.getAllValidation, FincashController.getAll);
router.post('/fincash', ensureAuthenticated, FincashController.createValidation, FincashController.create);
router.get('/fincash/:id', ensureAuthenticated, FincashController.getByIdValidation, FincashController.getById);
router.put('/fincash/finish/:id', ensureAuthenticated, FincashController.finishValidation, FincashController.finish);
router.put('/fincash/:id',ensureAuthenticated, ensureAdmin, FincashController.updateByIdValidation, FincashController.updateById);
router.get('/data', ensureAuthenticated, ensureAdmin, FincashController.getDataByDateValidation, FincashController.getDataByDate); //DASHBOARD GRAPH
router.put('/fincash/obs/:id', ensureAuthenticated, ensureAdmin, FincashController.updateObsValidation, FincashController.updateObs);
router.delete('/fincash/:id', ensureAuthenticated, ensureAdmin, FincashController.deleteByIdValidation, FincashController.deleteById);
router.post('/fincash/addcard/:id', ensureAuthenticated, ensureAdmin, FincashController.calcBreakValidation, FincashController.calcBreak);
router.post('/fincash/data/:id', ensureAuthenticated, ensureAdmin, FincashController.getDataByIdValidation, FincashController.getDataById);
router.get('/total-value/fincash/:id', ensureAuthenticated, FincashController.getTotalByFincashValidation, FincashController.getTotalByFincash);



// CASHOUTFLOW
router.post('/cashoutflow', ensureAuthenticated, CashOutflowController.createValidation, CashOutflowController.create);
router.get('/cashoutflow/:id', ensureAuthenticated, CashOutflowController.getByIdValidation, CashOutflowController.getById);
router.put('/cashoutflow/:id', ensureAuthenticated, CashOutflowController.updateByIdValidation, CashOutflowController.updateById);
router.get('/cashoutflow/all/:id', ensureAuthenticated, CashOutflowController.getAllValidation, CashOutflowController.getAllById);
router.get('/cashoutflow/total/:id', ensureAuthenticated, CashOutflowController.getTotalByIdValidation, CashOutflowController.getTotalById);
router.post('/cashoutflow/edit', ensureAuthenticated, ensureAdmin, CashOutflowController.editByIdValidation, CashOutflowController.editById);
// router.delete('/cashoutflow/:id',ensureAuthenticated, CashOutflowController.deleteByIdValidation, CashOutflowController.deleteById);



// SALE
router.get('/sale', ensureAuthenticated, SaleDetailController.getAllValidation, SaleDetailController.getAll);
router.post('/sale', ensureAuthenticated, SaleDetailController.createValidation, SaleDetailController.create);
router.get('/sale/all', ensureAuthenticated, SaleDetailController.getSalesValidation, SaleDetailController.getSales);
router.get('/sale/raw/:id', ensureAuthenticated, SaleDetailController.getByIdValidation, SaleDetailController.getById);
router.put('/sale/:id', ensureAuthenticated, SaleDetailController.updateByIdValidation, SaleDetailController.updateById);
router.delete('/sale/:id', ensureAuthenticated, SaleDetailController.cancelSaleValidation, SaleDetailController.cancelSale);
router.get('/sale/all/:id', ensureAuthenticated, SaleDetailController.getAllByIdValidation, SaleDetailController.getAllById);
router.get('/sale/fincash/:id', ensureAuthenticated, SaleDetailController.getSalesByFincashValidation, SaleDetailController.getSalesByFincash);
router.get('/sale/complete/:id', ensureAuthenticated, ensureAdmin, SaleDetailController.getAllByFincashValidation, SaleDetailController.getAllByFincash);



// USER
router.get('/role/get', UserController.getRole);
router.post('/login', UserController.signInValidation, UserController.signIn);
router.delete('/user/:id', UserController.deleteByIdValidation, UserController.deleteById);
router.get('/user', ensureAuthenticated, ensureAdmin, UserController.getAllValidation, UserController.getAll);
router.post('/register', ensureAuthenticated, ensureAdmin, UserController.createValidation, UserController.signUp);



// GROUP
router.get('/group/show', ensureAuthenticated, ProdGroupController.getShowGroups);
router.get('/group', ensureAuthenticated, ProdGroupController.getAllValidation, ProdGroupController.getAll);
router.post('/group', ensureAuthenticated, ProdGroupController.createValidation, ProdGroupController.create);
router.put('/group/show/:id', ensureAuthenticated, ProdGroupController.updateShowValidation, ProdGroupController.updateShow);
router.delete('/group/:id', ensureAuthenticated, ProdGroupController.deleteGroupByIdValidation, ProdGroupController.deleteGroupById);
router.post('/group/product/:id', ensureAuthenticated, ProdGroupController.putProdInGroupValidation, ProdGroupController.putProdInGroup);
router.get('/group/product/:id', ensureAuthenticated, ProdGroupController.getProductsByIdValidation, ProdGroupController.getProductsById);
router.post('/group/product/remove/:id', ensureAuthenticated, ProdGroupController.deleteProductByIdValidation, ProdGroupController.deleteProductById);



// STOCK
router.get('/stock', ensureAuthenticated, StockController.getAllValidation, StockController.getAll);
router.post('/stock', ensureAuthenticated, StockController.createValidation, StockController.create);
// router.get('/stock/:id', ensureAuthenticated, StockController.getAllByIdValidation, StockController.getAllById);
router.put('/stock/:id', ensureAuthenticated, ensureAdmin, StockController.updateByIdValidation, StockController.updateById);
// router.delete('/stock/:id', ensureAuthenticated, ensureAdmin, StockController.deleteByIdValidation, StockController.deleteById);



// SUPPLIER
router.get('/supplier', ensureAuthenticated, SupplierController.getAllValidation, SupplierController.getAll);
router.get('/supplier/:id', ensureAuthenticated, SupplierController.getByIdValidation, SupplierController.getById);
router.post('/supplier', ensureAuthenticated, ensureAdmin, SupplierController.createValidation, SupplierController.create);
router.put('/supplier/:id', ensureAuthenticated, ensureAdmin, SupplierController.updateByIdValidation, SupplierController.updateById);
router.delete('/supplier/:id', ensureAuthenticated, ensureAdmin, SupplierController.deleteByIdValidation, SupplierController.deleteById);



// VALIDITIES
router.post('/validity', ensureAuthenticated, ValidityController.createValidation, ValidityController.create);
router.get('/validity/all', ensureAuthenticated, ValidityController.getAllValidation, ValidityController.getAll);
router.get('/validity/:id', ensureAuthenticated, ValidityController.getAllByIdValidation, ValidityController.getAllById);
router.delete('/validity/:id', ensureAuthenticated, ValidityController.deleteByIdValidation, ValidityController.deleteById);



// PAYMENTS
router.get('/payment/total', ensureAdmin, PaymentController.getTotalByDateValidation, PaymentController.getTotalByDate);
router.post('/payment/get', ensureAdmin, PaymentController.getAllValidation, PaymentController.getAll);
router.get('/payment/:id', ensureAdmin, PaymentController.getByIdValidation, PaymentController.getById);
router.post('/payment', ensureAdmin, PaymentController.createValidation, PaymentController.create);
router.put('/payment/paid/:id', ensureAdmin,  PaymentController.markWithPaidValidation, PaymentController.markWithPaid);
router.put('/payment/back/:id', ensureAdmin,  PaymentController.markWithPaidValidation, PaymentController.unmarkWithPaid);
router.delete('/payment/:id', ensureAdmin, PaymentController.deleteByIdValidation, PaymentController.deleteById);




export { router };
