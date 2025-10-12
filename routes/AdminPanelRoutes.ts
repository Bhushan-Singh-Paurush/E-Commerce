export const ADMIN_DASHBOARD="/admin/dashboard"

//Order
export const ADMIN_ORDERS="/admin/orders"
export const ADMIN_EDIT_ORDER=(id:string)=>(id ? `/admin/orders/edit/${id}` : "")

// Media
export const ADMIN_MEDIA="/admin/media"
export const ADMIN_MEDIA_EDIT=(id:string)=> (id ? `/admin/media/edit/${id}` : "")


//Category
export const ADMIN_CATEGORY="/admin/category"
export const ADMIN_ADD_CATEGORY="/admin/category/add"
export const ADMIN_EDIT_CATEGORY=(id:string)=>(id ? `/admin/category/edit/${id}` : "")


//Product
export const ADMIN_PRODUCT="/admin/product"
export const ADMIN_ADD_PRODUCT="/admin/product/add"
export const ADMIN_EDIT_PRODUCT=(id:string)=>(id ? `/admin/product/edit/${id}` : "")

//Variant
export const ADMIN_PRODUCT_VARIANT="/admin/product/product-variant"
export const ADMIN_ADD_PRODUCT_VARIANT="/admin/product/product-variant/add"
export const ADMIN_EDIT_PRODUCT_VARIANT=(id:string)=>(id ? `/admin/product/product-variant/edit/${id}` : "")

//Coupon
export const ADMIN_COUPON="/admin/coupon"
export const ADMIN_ADD_COUPON="/admin/coupon/add"
export const ADMIN_EDIT_COUPON=(id:string)=>(id ? `/admin/coupon/edit/${id}` : "")


// Customers
export const ADMIN_CUSTOMERS="/admin/customers"

export const ADMIN_REVIEW="/admin/review"

