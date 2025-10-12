import { ADMIN_ADD_CATEGORY, ADMIN_ADD_COUPON, ADMIN_ADD_PRODUCT, ADMIN_CATEGORY, ADMIN_COUPON, ADMIN_CUSTOMERS, ADMIN_DASHBOARD, ADMIN_MEDIA, ADMIN_ORDERS, ADMIN_PRODUCT, ADMIN_PRODUCT_VARIANT, ADMIN_REVIEW } from "@/routes/AdminPanelRoutes";


const searchData = [
   {
       label: "Dashboard",
       description: "View website analytics and reports",
       url: ADMIN_DASHBOARD,
       keywords: ["dashboard", "overview", "analytics", "insights"]
   },
   {
       label: "Category",
       description: "Manage product categories",
       url: ADMIN_CATEGORY,
       keywords: ["category", "product category"]
   },
   {
       label: "Add Category",
       description: "Add new product categories",
       url: ADMIN_ADD_CATEGORY,
       keywords: ["add category", "new category"]
   },
   {
       label: "Product",
       description: "Manage all product listings",
       url: ADMIN_PRODUCT,
       keywords: ["products", "product list"]
   },
   {
       label: "Add Product",
       description: "Add a new product to the catalog",
       url: ADMIN_ADD_PRODUCT,
       keywords: ["new product", "add product"]
   },
   {
       label: "Product Variant",
       description: "Manage all product variants",
       url: ADMIN_PRODUCT_VARIANT,
       keywords: ["products variants", "variants"]
   },
   {
       label: "Coupon",
       description: "Manage active discount coupons",
       url: ADMIN_COUPON,
       keywords: ["discount", "promo", "coupon"]
   },
   {
       label: "Add Coupon",
       description: "Create a new discount coupon",
       url: ADMIN_ADD_COUPON,
       keywords: ["add coupon", "new coupon", "promotion", "offers"]
   },
   {
       label: "Orders",
       description: "Manage customer orders",
       url: ADMIN_ORDERS,
       keywords: ["orders"]
   },
   {
       label: "Customers",
       description: "View and manage customer information",
       url: ADMIN_CUSTOMERS,
       keywords: ["customers", "users"]
   },
   {
       label: "Review",
       description: "Manage customer reviews and feedback",
       url: ADMIN_REVIEW,
       keywords: ["ratings", "feedback"]
   },

   {
       label: "Media",
       description: "Manage website media files",
       url: ADMIN_MEDIA,
       keywords: ["images", "videos"]
   },

];

export default searchData;


