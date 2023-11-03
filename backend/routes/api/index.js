const router = require('express').Router();
const { setTokenCookie } = require('../../utils/auth.js');
const { User } = require('../../db/models');
const { restoreUser } = require('../../utils/auth.js');
const { requireAuth } = require('../../utils/auth.js');
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const groupsRouter = require('./groups.js');
const venuesRouter = require('./venues.js');
const eventsRouter = require('./events.js');
const groupImagesRouter = require('./groupimages.js');

router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/groups', groupsRouter);

router.use('/venues', venuesRouter);

router.use('/events', eventsRouter);

router.use('/group-images', groupImagesRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

// router.post('/test', function(req, res) {
//     res.json({ requestBody: req.body });
//   });

// router.get('/restore-user', (req, res) => {
//   return res.json(req.user);
//   }
// );

// router.get('/set-token-cookie', async (_req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: 'MilesMorales'
//     }
//   });
//   console.log(user);
//   setTokenCookie(res, user);
//   return res.json({ user: user });
// });

// router.get('/require-auth', requireAuth, (req, res) => {
//     return res.json(req.user);
//   }
// );

module.exports = router;
