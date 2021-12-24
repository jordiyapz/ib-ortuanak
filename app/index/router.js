const express = require("express");
const {
  register,
  login,
  add_anak,
  get_ortu,
  get_anak,
  edit_ortu,
  edit_anak,
  detail_anak,
  delete_anak,
} = require("./controller");

const {
  getUser,
  getRole,
  postRole
  
} = require("./adminController");

const router = express.Router();
const auth = require("../../middleware/auth");

// router user
router.post("/register", register);

// router login
router.post("/login", login);

// router get ortu
router.get("/ortu", auth, get_ortu);

// router edit ortu
router.put("/edit-ortu", auth, edit_ortu);

// router tambah anak
router.post("/tambah-anak", auth, add_anak);

// router get anak
router.get("/anak", auth, get_anak);

// router edit anak
router.put("/edit-anak/:id", auth, edit_anak);

// router detail anak
router.get("/anak/:id", auth, detail_anak);

// router edit anak
router.delete("/delete-anak/:id", auth, delete_anak);

router.get("/admin/getUser", getUser);

router.get("/admin/getRole", getRole);

router.post("/admin/postRole", postRole);

module.exports = router;
