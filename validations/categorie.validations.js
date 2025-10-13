import * as yup from "yup";

export const createCategorieSchema = yup.object({

    name : yup.string().required("le nom est obligatoire"),
    description : yup.string().required("la description est obligatoire")

});

export const updateCategorieSchema = yup.object({

    name : yup.string().required("le nom est obligatoire"),
    description : yup.string().required("la description est obligatoire")

});