import Stripe from "stripe";
import envConfig from "../../config/envConfig";


const stripe = new Stripe(envConfig.stripe.secret_key, {
    apiVersion: "2026-01-28.clover" as any
});

export default stripe 