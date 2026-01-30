import { CreatePaymentIntent, ReserveSeat } from "./booking.schema"

export const reserveSeat = async (data: ReserveSeat) => {
    // run lua script to server seat atomically
    // create reservation token
    
    

    // send in response
    // res.json({reservation_token: token})
    console.log(data)
}


//create payment intent for user

export const createPaymentIntent= (data:CreatePaymentIntent)=>{

    // check reservation token
    // extend its time

    // create user if not exists

    //


}