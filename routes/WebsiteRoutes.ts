export const WEBSITE_HOME="/"
export const WEBSITE_LOGIN="/auth/login"
export const WEBSITE_REGISTER="/auth/register"
export const WEBSITE_RESET_PASSWORD="/auth/reset-password"
export const WEBSITE_URL="http://localhost:3000"
export const WEBSITE_SHOP="/shop"
export const WEBSITE_PRODUCT_DETAILS=(slug:string)=> (slug ? `/shop/${slug}` : "")
export const WEBSITE_CART="/cart"
export const WEBSITE_CHECKOUT="/checkout"
export const WEBSITE_ORDER_DETAIL=(order_id:string)=> (order_id ? `/order-details/${order_id}` : "")
export const WEBSITE_ABOUT="/about-us"
export const WEBSITE_PRIVATE_POLICY="/privacy-policy"
export const WEBSITE_TERMS="/terms-and-conditions"
