import express from 'express'
import { createBatchController, updateBatchController, getBatchCategories, getAllBatchesController, deleteBatchController } from '../controllers/batchController.js'
import { verifyToken } from '../middleware/auth.js'
import { isAdmin } from '../middleware/isAdmin.js'


let routeBatch = express.Router()

// -----------------Batch--------------------------
routeBatch.post("/create-Batch", verifyToken, isAdmin, createBatchController)
routeBatch.put("/update-Batch/:updateId", verifyToken, isAdmin, updateBatchController)
routeBatch.get("/batch-categories", verifyToken, isAdmin, getBatchCategories)
routeBatch.get("/get-all-batches", verifyToken, isAdmin, getAllBatchesController)
routeBatch.delete("/delete-Batch/:id", verifyToken, isAdmin, deleteBatchController)

export default routeBatch