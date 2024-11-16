import { json, Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  try {
    //เข้าถึง DB ด้วย collection 
    const collection = db.collection("products");

    // ประกาศ productsAll เพื่อเก็บค่าที่ query ข้อมูล 
    const productsAll = await collection.find({}).toArray();
    return res.status(200).json({
      data: productsAll,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Can't not reach the products.",
    });
  }
});

productRouter.get("/:id", async (req, res) => {
  try {
      //เข้าถึง DB ด้วย collection 
    const collection = db.collection("products");
    // ประกาศ productId เพื่อรับค่า param จาก input
    const productId = new ObjectId(req.params.id);
    // ประกาศ productsIdData เพื่อรับค่าข้อมูล ที่ถูก query จาก database 
    const productsIdData = await collection.findOne({ _id: productId }); // ทำการ query ข้อมูล
    //ตรวจสอบว่าค่าที่ส่งมา มีในข้อมูล DB ไหม
    if (!productsIdData) {
      return res.status(404).json({ message: "Product not found." });
    }

    //ส่งค่าที่เก็บไว้หลังจาก query เสร็จกลับไป productsIdData
    return res.status(200).json({ data: productsIdData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Can't not reach the products by Id.",
    });
  }
});

productRouter.post("/", async (req, res) => {
  try {
    //  เข้าถึง collection ชื่อ "products" จาก Database
    const collection = db.collection("products");
    //  ประกาศ  productsData เพื่อ เก็บข้อมูล ที่ดึงมาจาก input เพื่อเตรียมไป บันทึกใน DB
    const productsData = { ...req.body, created_at: new Date() };
    // ประกาศ newProducts เพื่อเก็บผลลัพท์ค่า query ที่เพิ่มสินค้า และส่งกลับไปที่ BD 
    const newProducts = await collection.insertOne(productsData);
    return res.status(201).json({
      message: "Product has been created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Can't not creat the products.",
    });
  }
});

productRouter.put("/:id", async (req, res) => {
try {
     //  เชื่อมต่อกับ Collection ที่ชื่อ "products" ใน Database
const collection = db.collection("products");
    //  ดึง id ที่ส่งมาใน URL (Endpoint parameter) และ Convert ให้เป็น ObjectId
const productId = new ObjectId(req.params.id)

//  ดึงข้อมูลทั้งหมดจาก Body ของ Request (req.body)  เก็บไว้ ใน updateProductsData
const updateProductsData = {...req.body} 

// 4 Update ข้อมูลใน Database กำหนดข้อมูลใหม่ที่ต้องการอัปเดตจาก updateProductsData ด้วย $set
const updateProduct = await collection.updateOne(
{_id: productId},
{$set: updateProductsData}
); 
/// 5 ส่งผลลัพธ์กลับไปยัง Client โดยการ ResStatus 200
res.status(200).json({
  "message": "Product has been updated successfully"
});

} catch (error) {
  console.log(error);
  return res.status(500).json({
    message: "Can't update the product.",
  });
}

});

productRouter.delete("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");

    const productId = new ObjectId(req.params.id);
    const deleteProductData = await collection.deleteOne({ _id: productId });
 
    return res.status(200).json({
      message: "Product has been deleted successfully",
    });
  } catch (error) {
    console.log(error); 
    return res.status(500).json({
      message: "Can't delete the product.", 
    });
  }
});


export default productRouter;
