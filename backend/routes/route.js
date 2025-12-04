import express from 'express';
import * as UserController from '../controller/user-controller.js';
import passport from 'passport';
import '../config/passportConfig.js';
import multer from 'multer';
import { create_journal, getPostsByUsername, update_journal, delete_journal } from '../controller/journal-controller.js';
import { getAnonymousPosts, createAnonymousPost } from '../controller/anonymous-controller.js';
import { createMood, getMoods } from '../controller/mood-controller.js';
import upload from '../multer/multerConfig.js';
import upload1 from '../multer/multerConfig1.js';
import { getJournalById } from '../controller/journal-controller.js';
import cors from 'cors';

const router = express.Router();
router.use(cors());

router.post('/signup', upload.single('profilePicture'), UserController.userSignup);
router.post('/login', UserController.userLogin);
router.get('/users', UserController.getUsers);
router.get('/:username/getuserdetails', UserController.getUserDetails);
router.delete('/delete-user/:username', UserController.deleteUser);
router.patch('/:username/update-user', UserController.updateUser);

router.get('/anonymousPosts', getAnonymousPosts);
router.post('/createAnonymousPosts', createAnonymousPost);

router.post('/:username', upload1.single('coverPicture'), create_journal);
router.get('/:username/journals', getPostsByUsername);
router.put('/journals/:username/:id', update_journal);
router.delete('/journal-delete/:username/:id', delete_journal);
router.get('/:username/:id', getJournalById);

router.get('/api/moods/:username', getMoods);
router.post('/api/moods/:username', createMood);

export default router;
