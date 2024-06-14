import express from 'express';
const router = express.Router();
import multer from 'multer';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './my-uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null,uniqueSuffix+ '-' + file.originalname)
    }
  })

const upload = multer({storage});
const {getAllUsers,getUserById,addUserDetails,updateUserById,deleteUserById,userLogin,getAllUsersWithDateRange} = require('../controller/user');


router.route('/')
 .get(getAllUsers);

 router.route('/dateRange')
 .get(getAllUsersWithDateRange);
 
router.route('/login').post(userLogin);

router.route('/').post(upload.single('userImage'),addUserDetails);

router
    .route('/:id')
    .get(getUserById)
    .patch(updateUserById)
    .delete(deleteUserById);

module.exports = router;