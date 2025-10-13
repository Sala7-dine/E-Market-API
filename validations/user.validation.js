import * as yup from "yup";

export const createUserSchema = yup.object({
    fullName: yup.string().required("Le nom est obligatoire"),
    email: yup.string().email("Email invalide").required("L'email est obligatoire"),
    password: yup.string().min(8, "Minimum 8 caractères").required()
});

export const updateUserSchema = yup.object({
    fullName: yup.string().min(3).max(50),
    email: yup.string().email("Email invalide")
});
