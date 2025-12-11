import {
    UserController,
    PackController,
    StockController,
    ProductController,
    FincashController,
    PaymentController,
    SupplierController,
    ValidityController,
    PurchaseController,
    ProdGroupController,
    NFEmitterController,
    SaleDetailController,
    CashOutflowController,
    SupplierProdMapController,
} from './../../Modules/Controllers';
import { Router } from 'express';
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
router.get('/data', ensureAuthenticated, ensureAdmin, FincashController.getDataByDateValidation, FincashController.getDataByDate); //DASHBOARD GRAPH
router.put('/fincash/:id', ensureAuthenticated, ensureAdmin, FincashController.updateByIdValidation, FincashController.updateById);
router.put('/fincash/obs/:id', ensureAuthenticated, ensureAdmin, FincashController.updateObsValidation, FincashController.updateObs);
router.delete('/fincash/:id', ensureAuthenticated, ensureAdmin, FincashController.deleteByIdValidation, FincashController.deleteById);
router.post('/fincash/addcard/:id', ensureAuthenticated, ensureAdmin, FincashController.calcBreakValidation, FincashController.calcBreak);
router.post('/fincash/data/:id', ensureAuthenticated, ensureAdmin, FincashController.getDataByIdValidation, FincashController.getDataById);
router.get('/total-value/fincash/:id', ensureAuthenticated, FincashController.getTotalByFincashValidation, FincashController.getTotalByFincash);
router.put('/fincash/reopen/:fincash_id', ensureAuthenticated, ensureAdmin, FincashController.reOpenFincashValidation, FincashController.reOpenFincash);



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



// STOCK
router.put('/stock/update/:prod_id', ensureAuthenticated, ensureAdmin, StockController.updateValidation, StockController.update);
router.put('/stock/updateTo/:prod_id', ensureAuthenticated, ensureAdmin, StockController.updateValidation, StockController.updateTo);



// GROUP
router.get('/group/show', ensureAuthenticated, ProdGroupController.getShowGroups);
router.get('/group', ensureAuthenticated, ProdGroupController.getAllValidation, ProdGroupController.getAll);
router.post('/group', ensureAuthenticated, ProdGroupController.createValidation, ProdGroupController.create);
router.put('/group/show/:id', ensureAuthenticated, ProdGroupController.updateShowValidation, ProdGroupController.updateShow);
router.delete('/group/:id', ensureAuthenticated, ProdGroupController.deleteGroupByIdValidation, ProdGroupController.deleteGroupById);
router.post('/group/product/:id', ensureAuthenticated, ProdGroupController.putProdInGroupValidation, ProdGroupController.putProdInGroup);
router.get('/group/product/:id', ensureAuthenticated, ProdGroupController.getProductsByIdValidation, ProdGroupController.getProductsById);
router.post('/group/product/remove/:id', ensureAuthenticated, ProdGroupController.deleteProductByIdValidation, ProdGroupController.deleteProductById);



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
router.put('/payment/paid/:id', ensureAdmin, PaymentController.markWithPaidValidation, PaymentController.markWithPaid);
router.put('/payment/back/:id', ensureAdmin, PaymentController.markWithPaidValidation, PaymentController.unmarkWithPaid);
router.delete('/payment/:id', ensureAdmin, PaymentController.deleteByIdValidation, PaymentController.deleteById);



// PURCHASE
router.post('/purchase', ensureAdmin, PurchaseController.createValidation, PurchaseController.create);
router.get('/purchase', ensureAdmin, PurchaseController.getPurchasesValidation, PurchaseController.getPurchases);
router.delete('/purchase/:id', ensureAdmin, PurchaseController.deleteByIdValidation, PurchaseController.deleteById);
router.put('/purchase/:purchase_id', ensureAdmin, PurchaseController.editPurchaseValidation, PurchaseController.editPurchase);
router.get('/purchase/:purchase_id', ensureAdmin, PurchaseController.getPurchaseDetailsValidation, PurchaseController.getPurchaseDetails);
router.put('/purchase/complete/:purchase_id', ensureAdmin, PurchaseController.completePurchaseValidation, PurchaseController.completePurchase);



// PACK
router.post('/pack', ensureAdmin, PackController.createValidation, PackController.create);
router.get('/pack', ensureAdmin, PackController.getPacksValidation, PackController.getPacks);
router.get('/pack/products', ensureAdmin, PackController.getProdsValidation, PackController.getProds);
router.delete('/pack/:id', ensureAdmin, PackController.deleteByIdValidation, PackController.deleteById);
router.get('/pack/:prodId', ensureAdmin, PackController.getPacksByProdValidation, PackController.getPacksByProd);
router.get('/pack/getProds/:packId', ensureAdmin, PackController.getProdsByPackValidation, PackController.getProdsByPack);
router.post('/pack/putPacks/:prodId', ensureAdmin, PackController.putPacksInProdValidation, PackController.putPacksInProd);
router.post('/pack/putProds/:packId', ensureAdmin, PackController.putProdsInPackValidation, PackController.putProdsInPack);
router.delete('/pack/removePacks/:prodId', ensureAdmin, PackController.removePacksByProdValidation, PackController.removePacksByProd);
router.delete('/pack/removeProds/:packId', ensureAdmin, PackController.removeProdsByPackValidation, PackController.removeProdsByPack);



// NFEMITTER
router.post('/nfemitter', ensureAdmin, NFEmitterController.createValidation, NFEmitterController.create);
router.get('/nfemitter/:cnpj', ensureAdmin, NFEmitterController.getByCnpjValidation, NFEmitterController.getByCnpj);
router.put('/nfemitter/:emitter_id/linkSupplier', ensureAdmin, NFEmitterController.linkToSupplierValidation, NFEmitterController.linkToSupplier);



// PROD SUP MAP
router.post('/supplier-prod-map', ensureAdmin, SupplierProdMapController.createValidation, SupplierProdMapController.create);
router.get('/supplier-prod-map/:supplier_id/:supplier_prod_id', ensureAdmin, SupplierProdMapController.getMapValidation, SupplierProdMapController.getMap);



export { router };
