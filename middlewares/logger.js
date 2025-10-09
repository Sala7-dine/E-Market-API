export default function (req, res, next){
    console.log(`${req.method} ${req.url} - ${new Date().toLocaleString()}`);
    next();
};
