import cloudinary from "@/lib/cloudinary";
import { isAuthenticated } from "@/lib/helperFunction/isAuthenticated";
import { catchError, response } from "@/lib/helperFunction/responeFuction";
import { zSchema } from "@/lib/zodSchema";
import User from "@/models/user.model";
import { NextRequest } from "next/server";


export async function POST(request: NextRequest) {
  try {
    const { isAuth, email } = await isAuthenticated({ role: "user" });

    if (!isAuth)
      return response({
        success: false,
        status: 401,
        message: "unauthenticated",
      });

    const formdata = await request.formData();

    const file = formdata.get("file") as File;

    const payload = Object.fromEntries(formdata.entries());

    delete payload.file;

    const validSchema = zSchema.pick({
      address: true,
      phone: true,
      name: true,
    });

    const isValid = validSchema.safeParse(payload);

    if (!isValid.success)
      return response({
        success: false,
        status: 400,
        message: "missing or invalid input",
      });

    const { address, name, phone } = isValid.data;

    const user = await User.findOne({ email });

    if (!user)
      return response({
        success: false,
        status: 404,
        message: "user not found",
      });

    user.address = address;
    user.name = name;
    user.phone = phone;

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

      try {
        const uploadResponse = await cloudinary.uploader.upload(base64, {
          upload_preset: process.env.NEXT_PUBLIC_PRESET,
        });

        if (uploadResponse) {
          if (user?.avatar?.public_id) {
            try {
              await cloudinary.uploader.destroy(user?.avatar?.public_id);
            } catch (error) {
              return catchError({error})
              
            }
          } 
            user.avatar.url = uploadResponse.secure_url
            user.avatar.public_id = uploadResponse.public_id
          
        }
      } catch (error) {
            return catchError({error})
      }
    }

    await user.save();

    return response({ success: true, status: 200, message: "Profile Updated",data:user });
  
} catch (error) {
   return catchError({error})
}
}
