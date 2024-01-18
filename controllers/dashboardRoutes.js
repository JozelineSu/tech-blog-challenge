const router = require('express').Router();
const { Post, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
    try {
      const userData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ['password'] },
        include: [{ model: Post }],
      });
  
      const user = userData.get({ plain: true });
  
      res.render('dashboard', {
        ...user,
        logged_in: true
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get('/newpost', async (req, res) => {
    try {
      res.render('newpost')
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.post('/newpost', async (req, res) => {
    try {
      const newPost = await Post.create({
        ...req.body,
        user_id: req.session.user_id,
      });

      res.status(200).json(newPost);
    } catch (err) {
      res.status(400).json(err);
    }
  });

  router.get('/userpost/:id', async (req, res) => {
    try {
      const userData = await Post.findByPk(req.params.id, {
        attributes: ['title', 'content'],
      });

      const userPost = userData.get({ plain: true });

      res.render('userpost', {
        ...userPost,
        logged_in: req.session.logged_in
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.put('/userpost/:id', async (req, res) => {
    try {
      const userData = await Post.update(req.body,
        {
          where: {
            id: req.params.id,
            user_id: req.session.user_id,
          },
        });

        if (!userData) {
          res.status(404).json({ message: 'No post with this id'});
          return;
        }

        res.status(200).json(userData);
    } catch (err) {
     res.status(500).json(err);
    }
  });

  router.delete('/userpost/:id', async (req, res) => {
    try {
      const postData = await Post.destroy({
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      });

      if (!postData) {
        res.status(404).json({ message: 'No post with this id'});
        return;
      }

      res.status(200).json(postData);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  module.exports = router;