const express = require('express');
const posts = require('../data/db.js');
const comments = require('../data/db.js');

const router = express.Router();

router.get('/', (req, res) => {
  posts
    .find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: 'The posts information could not be retrieved.' });
    });
});

router.get('/:id', (req, res) => {
  posts
    .findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: 'The post with the specified ID does not exist.',
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: 'The post information could not be retrieved.',
      });
    });
});

router.get('/:id/comments', (req, res) => {
  posts
    .findCommentById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: 'The post with the specified ID does not exist.',
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: 'The comments information could not be retrieved.',
      });
    });
});

router.post('/', (req, res) => {
  if (!req.body.title || !req.body.contents) {
    return res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.',
    });
  }

  posts
    .insert(req.body)
    .then((user) => {
      res.status(201).json(req.body);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: 'There was an error while saving the post to the database',
      });
    });
});

router.post('/:id/comments', (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({
      errorMessage: 'Please provide text for the comment.',
    });
  }
  posts
    .findById(req.params.id)
    .then((post) => {
      if (post === undefined) {
        res.status(404).json({
          message: 'The post with the specified ID does not exist.',
        });
      } else {
        const comment = {
          post_id: req.params.id,
          text: req.body.text,
        };
        comments
          .insertComment(comment)
          .then((comment) => {
            if (comment) {
              res.status(201).json(req.body);
            }
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({
              error:
                'There was an error while saving the comment to the database',
            });
          });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: 'There was an error while saving the comment to the database',
      });
    });
});

router.delete('/:id', (req, res) => {
  posts
    .remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({
          message: 'Deleted',
        });
      } else {
        res.status(404).json({
          message: 'The post with the specified ID does not exist.',
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: 'The post could not be removed',
      });
    });
});

router.put('/:id', (req, res) => {
  if (!req.body.title || !req.body.contents) {
    return res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.',
    });
  }

  posts
    .update(req.params.id, req.body)
    .then((posts) => {
      if (posts) {
        res.status(200).json(req.body);
      } else {
        res.status(404).json({
          message: 'The post with the specified ID does not exist.',
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: 'The post information could not be modified.',
      });
    });
});

module.exports = router;
