import {z} from 'zod'

export const usernameValidation = z.string().min(2, "Username must be atleast 2 charecters").max(20)
.regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special charecter");

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: 'Invalid Email Address'}),
    password: z.string().min(8,{message: "Minimum 8 charecters needed"})
})