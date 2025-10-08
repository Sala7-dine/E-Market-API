import { createProduct , getAllProducts ,  deleteProduct , updateProduct} from "../services/productService.js";

export const GetProducts = async (req , res) => {

    try {

        const data = await getAllProducts();

        if(!data) {
            throw new Error('aucun data dans database');
        }

        res.status(201).json({
            success : true,
            data : data
        });

    }catch (err) {
        throw new Error(err.message);
    }

}

export const CreateProduct = async (req , res , next) => {

    try{
        const productData = req.body;
        const newProduct = await create(productData);

        res.status(201).json({
            success : true,
            message : "Produit cree avec succes",
            data : newProduct
        });

    }catch(err){
        throw new Error(err.message);
    }

}


export const UpdateProduct = async (req , res) => {

    try {

        const id = req.params.id;
        const product = req.body;

        const data = await updateProduct(id , product);

        res.status(201).json({
            success : true,
            message : "le produit modifier avec succee",
            data : data
        });


    }catch (err){
        throw new Error(err.message);
    }

}

export const DeleteProduct = async (req , res) => {

    try {
        const id = req.params.id;

        const newProduit = await deleteProduct(id);

        res.status(201).json({
            success : true,
            data : newProduit
        });

    }catch(err){
        throw new Error(err.message);
    }



}
