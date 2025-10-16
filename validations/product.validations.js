import * as yup from "yup";

export const createProductSchema = yup.object({
    title: yup.string().required("le titre est obligatoire"),
    description: yup.string().required("la description est obligatoire"),
    prix: yup.number().positive("Le prix doit être positif").required("le prix est obligatoire"),
    stock: yup.number().integer().min(0).required("le stock est obligatoire"),
    categories: yup.array().required("la catégorie est obligatoire"),
    imageUrl: yup.string().url("URL invalide")
});

export const updateProductSchema = yup.object({
    title: yup.string(),
    description: yup.string(),
    prix: yup.number().positive("Le prix doit être positif"),
    stock: yup.number().integer().min(0),
    categories: yup.array(),
    imageUrl: yup.string().url("URL invalide")
});