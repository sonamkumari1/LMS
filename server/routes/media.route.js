import express from "express";
import upload from "../utils/multer.js";
import { uploadMedia } from "../utils/cloudinary.js";

const router=express.Router();

router.route("/upload-video").post(upload.single("file"), async(req,res)=>{
    try {
        const result=await uploadMedia(req.file.path);
        res.status(200).json({
            success:true,
            message:"Video uploaded successfully",
            data:result
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Video upload failed",
            error:error.message
        })
    }
})



export default router;
