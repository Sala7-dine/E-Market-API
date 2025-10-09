import { createUser , getAllUsers ,  deleteUser , updateUser} from "../services/userService.js";

export const GetUsers = async (req , res) => {

    try {

        const data = await getAllUsers();

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

export const CreateUser = async (req , res , next) => {

    try{
        const userData = req.body;
        const newUser = await createUser(userData);

        res.status(201).json({
            success : true,
            message : "Produit cree avec succes",
            data : newUser
        });

    }catch(err){
        throw new Error(err.message);
    }

}


export const UpdateUser = async (req , res) => {

    try {

        const id = req.params.id;
        const user = req.body;

        const data = await updateUser(id , user);

        res.status(201).json({
            success : true,
            message : "le produit modifier avec succee",
            data : data
        });


    }catch (err){
        throw new Error(err.message);
    }

}

export const DeleteUser = async (req , res) => {

    try {
        const id = req.params.id;

        const newProduit = await deleteUser(id);

        res.status(201).json({
            success : true,
            data : newProduit
        });

    }catch(err){
        throw new Error(err.message);
    }



}
