// server/routes/teams.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createTeam,
  getTeams,
  getTeam,
  updateTeam,
  deleteTeam,
  addTeamMember,
  removeTeamMember,
  updateMemberRole
} = require('../controllers/teamController');

// All routes are protected and require authentication
router.use(protect);

// Team routes
router.route('/')
  .get(getTeams)
  .post(createTeam);

router.route('/:id')
  .get(getTeam)
  .put(updateTeam)
  .delete(deleteTeam);

// Team member routes
router.route('/:id/members')
  .post(addTeamMember);

router.route('/:id/members/:memberId')
  .delete(removeTeamMember)
  .put(updateMemberRole);

module.exports = router;