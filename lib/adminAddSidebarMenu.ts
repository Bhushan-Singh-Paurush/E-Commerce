import { AiOutlineDashboard } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { IoShirtOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";
import { LuUserRound } from "react-icons/lu";
import { IoMdStarOutline } from "react-icons/io";
import { MdOutlinePermMedia } from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";
import { ADMIN_ADD_CATEGORY, ADMIN_ADD_COUPON, ADMIN_ADD_PRODUCT, ADMIN_ADD_PRODUCT_VARIANT, ADMIN_CATEGORY, ADMIN_COUPON, ADMIN_CUSTOMERS, ADMIN_DASHBOARD, ADMIN_MEDIA, ADMIN_ORDERS, ADMIN_PRODUCT, ADMIN_PRODUCT_VARIANT, ADMIN_REVIEW } from "@/routes/AdminPanelRoutes";



export const adminAddSidebarMenu=[
       {
        title:"Dashboard",
        url:ADMIN_DASHBOARD,
        icon:AiOutlineDashboard
       },
       {
        title:"Category",
        url:"#",
        icon:BiCategory,
        submenu:[
            {
                title:"Add Category",
                url:ADMIN_ADD_CATEGORY
            },
            {
                title:"All Category",
                url:ADMIN_CATEGORY
            },
        ]
       },
       {
        title:"Products",
        url:"#",
        icon:IoShirtOutline,
        submenu:[
            {
                title:"Add Product",
                url:ADMIN_ADD_PRODUCT
            },
            {
                title:"Add Varient",
                url:ADMIN_ADD_PRODUCT_VARIANT
            },
            {
                title:"All Product",
                url:ADMIN_PRODUCT
            },
            {
                title:"All Product Varients",
                url:ADMIN_PRODUCT_VARIANT
            },
        ]
       },
       {
        title:"Coupons",
        url:"#",
        icon:RiCoupon2Line,
        submenu:[
            {
                title:"Add Coupons",
                url:ADMIN_ADD_COUPON
            },
            {
                title:"All Coupons",
                url:ADMIN_COUPON
            },
         ]
       },
       {
        title:"Orders",
        url:ADMIN_ORDERS,
        icon:MdOutlineShoppingBag
       },
       {
        title:"Customers",
        url:ADMIN_CUSTOMERS,
        icon:LuUserRound
       },
       {
        title:"Review & Rating",
        url:ADMIN_REVIEW,
        icon:IoMdStarOutline
       },
       {
        title:"Media",
        url:ADMIN_MEDIA,
        icon:MdOutlinePermMedia
       },
]