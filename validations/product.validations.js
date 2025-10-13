import * as yup from "yup";

export const createProductSchema = yup.object({

    title : yup.string().required("le titre est obligatoire"),
    description : yup.string().required("la description est obligatoire"),
    prix : yup.number().positive("Le prix doit être positif").required("le prix est obligatoire"),
    stock: yup.number().required("le stocke est obligatoire"),
    imageUrl: yup.string(),
    categories : yup.array()

});

export const updateProductSchema = yup.object({

    title : yup.string().required("le titre est obligatoire"),
    description : yup.string().required("la description est obligatoire"),
    prix : yup.number().positive("Le prix doit être positif").required("le prix est obligatoire"),
    stock: yup.number().required("le stocke est obligatoire"),
    imageUrl: yup.string(),
    categories : yup.array()

});