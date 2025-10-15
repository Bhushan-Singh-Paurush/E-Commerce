import { catchError, response } from "@/lib/helperFunction/responeFuction";
import Category from "@/models/category.model";
import Product from "@/models/product.model";
import { FilterQuery } from "mongoose";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") ?? "0", 10);
    const limit = parseInt(searchParams.get("limit") ?? "0", 10);
    const minPrice = parseInt(searchParams.get("minPrice") ?? "0", 10);
    const maxPrice = parseInt(searchParams.get("maxPrice") ?? "3000", 10);
    const sorting = searchParams.get("sorting");
    const color = searchParams.get("color")?.split(",");
    const size = searchParams.get("size")?.split(",")
    const search = searchParams.get("q");
    const category = searchParams.get("category")?.split(",");



    const categoryIds = await Category.find({ slug: { $in: category } })
      .select("_id")
      .lean();

      
      const matchQuery:FilterQuery<typeof Product>={}
      
      if(categoryIds.length>0)
      {
           const catArray = categoryIds.map((cat) => cat._id);
           matchQuery.category={$in:catArray} 
      }  
      
     if (search) 
      matchQuery.name = { $regex: search, $options: "i" };

    let sortData = {};
    if (sorting === "default") sortData = { createdAt: -1 };
    else if (sorting === "asc") sortData = { name: 1 };
    else if (sorting === "desc") sortData = { name: -1 };
    else if (sorting === "lowToHigh") sortData = { sellingPrice: 1 };
    else if (sorting === "highToLow") sortData = { sellingPrice: -1 };

    const skip = page * limit;

    const productData = await Product.aggregate([
      {
        $match: matchQuery,
      },
      {
        $sort: sortData,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit+1,
      },
      {
         $lookup:{
            from:"variants",
            localField:"_id",
            foreignField:"product",
            as:"variants"
         }
      },
{
  $addFields: {
    variants: {
      $filter: {
        input: "$variants",
        as: "variant",
        cond: {
          $and: [
            size ? { $in: ["$$variant.size", size] } : { $literal: true },
            color ? { $in: ["$$variant.color", color] } : { $literal: true },
            { $gte: ["$$variant.sellingPrice", minPrice] },
            { $lte: ["$$variant.sellingPrice", maxPrice] }
          ]
        }
      }
    }
  }
},
     
{
  $match:{
      variants:{$ne:[]}   
  }
},

{
         $lookup:{
            from:"media",
            localField:"media",
            foreignField:"_id",
            as:"media"
         }
      },
      {
        $project:{
            _id:1,
            slug:1,
            name:1,
            discount:1,
            mrp:1,
            sellingPrice:1,
            description:1,
            variants:{
                 color:1,
                 size:1,
                 mrp:1,
                 sellingPrice:1,
                 discount:1,
            },
            media:{
                _id:1,
                secure_url:1,
                alt:1
            }
        }
      }
      ]);


      if(productData.length===0)
        return response({success:false,status:404,message:"No Product found"})
    
    let hasMore=null  
    if(productData.length>limit)
    {
        hasMore=page+1;
        productData.pop(); 
    }
    
      return response({success:true,status:200,data:{productData,hasMore}})  
  } catch (error) {
   return catchError({error})
  }
}
