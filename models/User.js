import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        fullName : {
            type : String,
            required : [true  ,"le nom et prenom est obligatoire"]
        },
        email : {
            type : String,
            required : [true , "l'email et obligatoire est obligatoire"]
        },
        password : {
            type : String,
            required : [true , "le password et obligatoire"]
        },
        role: {
            type: String,
            enum : ['admin' , 'user'],
            default : "user"
        },
        isDelete : {
            type : Boolean,
            default : false
        }
    },

    { timestamps: true }
);

export default mongoose.model('User' , UserSchema);