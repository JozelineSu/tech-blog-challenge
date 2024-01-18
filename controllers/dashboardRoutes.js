const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
    try {
      const postData = await Post.findAll( {
        where: {user_id: req.session.user_id},
        attributes: ['id', 'title', 'content', 'date_created'],
        include: [
            {
              model: User,
              attributes: ['username'],
            },
            {
              model: Comment,
              attributes: ['id', 'content', 'date_created', 'user_id', 'post_id'],
              include: {
                model: User,
                attributes: ['username']
              }
            }
          ],
      });
  
      const post = postData.get({ plain: true });
  
      res.render('dashboard', {
        ...post,
        logged_in: true
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });

  module.exports = router;