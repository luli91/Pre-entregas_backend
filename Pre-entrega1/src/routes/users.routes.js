// import { Router } from "express";
// import {getUsers, saveUser} from '../controllers/user.controller.js';//agregue

// const router = Router();

// router.get("/", getUsers);
// router.post("/", saveUser);

// export default router;
import { Router } from 'express';
import usersController from '../controllers/users.controller.js';

const router = Router();

router.get('/', usersController.getAllUsers);

router.get('/:uid', usersController.getUser);
router.put('/:uid', usersController.updateUser);
router.delete('/:uid', usersController.deleteUser);


export default router;