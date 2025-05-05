const multer = require('multer');


// Configure Storage

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename:(req, file, cb) => {
     cb(null, `${Date.now()}-${file.originalname}`);
    },
})

// file filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'imag/jpg'];
    if(allowedTypes.includes(file.mimetype)){
        cb(null, true);
    }else{
        cb(new Error('Only .jpeg , .png and .jpg formats are allowed'), false);
    }
};

const upload = multer({storage, fileFilter});

module.exports= upload;