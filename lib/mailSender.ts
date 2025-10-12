import nodemailer from "nodemailer"

type sendMailProps={
    subject:string,
    reciver:string,
    body:string,
}

export async function sendMail({subject,reciver,body}:sendMailProps) {
    const transport=nodemailer.createTransport({
            host:process.env.HOST,
            port: 587,
            secure: false,
            auth:{
                user:process.env.USER,
                pass:process.env.PASS
            }
    })

    try {
        await transport.sendMail({
            from:"E-Commers",
            subject:subject,
            to:reciver,
            html:body
        })

        return {
            success:true,
            message:"mail send successfully"
        }

    } catch (error) {
        return {
            success:false,message:(error as Error).message
        }
    }
}