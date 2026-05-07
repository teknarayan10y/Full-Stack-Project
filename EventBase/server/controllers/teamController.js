const Team = require('../models/team');
const asyncHandler = require('express-async-handler');

// @desc    Create a new team
// @route   POST /api/v1/teams
// @access  Private
exports.createTeam = asyncHandler(async (req, res) => {
  try {
    const { name, description, tags, isPrivate } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Team name is required'
      });
    }

    // Create team with the creator as the first member (admin)
    const teamData = {
      name,
      description: description || '',
      tags: Array.isArray(tags) ? tags : [],
      isPrivate: !!isPrivate,
      createdBy: userId,
      members: [{
        user: userId,
        role: 'admin',
        joinedAt: Date.now()
      }]
    };

    // Create the team
    let team = await Team.create(teamData);
    
    // Populate the created team with user details
    team = await Team.findById(team._id)
      .populate('createdBy', 'name email')
      .populate({
        path: 'members.user',
        select: 'name email',
        model: 'User'
      });

    res.status(201).json({
      success: true,
      data: team
    });
  } catch (error) {
    console.error('Error creating team:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'A team with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create team',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get all teams
// @route   GET /api/v1/teams
// @access  Private
exports.getTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find({})
    .populate('createdBy', 'name email')
    .populate('members.user', 'name email');
    
  res.status(200).json({
    success: true,
    count: teams.length,
    data: teams
  });
});

// @desc    Get single team
// @route   GET /api/v1/teams/:id
// @access  Private
exports.getTeam = asyncHandler(async (req, res) => {
  try {
    console.log('Fetching team with ID:', req.params.id);
    
    let team = await Team.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate({
        path: 'members.user',
        select: 'name email avatar',
        model: 'User'
      })
      .lean();

    if (!team) {
      console.log('Team not found');
      return res.status(404).json({
        success: false,
        error: 'Team not found'
      });
    }

    // Ensure members array exists and has at least the creator
    if (!team.members || team.members.length === 0) {
      console.log('No members found, adding creator as admin');
      team.members = [{
        user: team.createdBy,
        role: 'admin',
        joinedAt: team.createdAt
      }];
    } else {
      console.log(`Team has ${team.members.length} members`);
      console.log('First member:', team.members[0]);
    }

    // Convert Mongoose document to plain object and add member count
    const teamData = {
      ...team,
      memberCount: team.members.length
    };

    res.status(200).json({
      success: true,
      data: teamData
    });
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Update team
// @route   PUT /api/v1/teams/:id
// @access  Private
exports.updateTeam = asyncHandler(async (req, res) => {
  try {
    const { name, description, tags, isPrivate } = req.body;
    
    // Find the team
    let team = await Team.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate({
        path: 'members.user',
        select: 'name email',
        model: 'User'
      });

    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team not found'
      });
    }

    // Check if user is the team admin
    const isAdmin = team.members.some(
      member => member.user._id.toString() === req.user._id.toString() && member.role === 'admin'
    );

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this team'
      });
    }

    // Update team fields
    team.name = name || team.name;
    team.description = description !== undefined ? description : team.description;
    team.tags = Array.isArray(tags) ? tags : team.tags;
    team.isPrivate = isPrivate !== undefined ? isPrivate : team.isPrivate;
    team.updatedAt = Date.now();

    // Save the updated team
    await team.save();

    res.status(200).json({
      success: true,
      data: team
    });
  } catch (error) {
    console.error('Error updating team:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'A team with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update team',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Delete team
// @route   DELETE /api/v1/teams/:id
// @access  Private
exports.deleteTeam = asyncHandler(async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team not found'
      });
    }

    // Check if user is the team admin
    const isAdmin = team.members.some(
      member => member.user.toString() === req.user._id.toString() && member.role === 'admin'
    );

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this team. Only team admins can delete the team.'
      });
    }

    // Delete the team
    await Team.findByIdAndDelete(req.params.id);
    
    // Alternative approach if the above doesn't work
    // await Team.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error in deleteTeam:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting team',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Add team member
// @route   POST /api/v1/teams/:id/members
// @access  Private
exports.addTeamMember = asyncHandler(async (req, res) => {
  const { userId, role = 'member' } = req.body;
  
  const team = await Team.findById(req.params.id);

  if (!team) {
    return res.status(404).json({
      success: false,
      error: 'Team not found'
    });
  }

  // Check if user is the team admin
  const isAdmin = team.members.some(
    member => member.user.toString() === req.user._id.toString() && member.role === 'admin'
  );

  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to add members to this team'
    });
  }

  // Check if user is already a member
  const isMember = team.members.some(
    member => member.user.toString() === userId
  );

  if (isMember) {
    return res.status(400).json({
      success: false,
      error: 'User is already a member of this team'
    });
  }

  // Add member
  team.members.push({
    user: userId,
    role,
    joinedAt: Date.now()
  });

  await team.save();

  res.status(200).json({
    success: true,
    data: team
  });
});

// @desc    Remove team member
// @route   DELETE /api/v1/teams/:id/members/:memberId
// @access  Private
exports.removeTeamMember = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    return res.status(404).json({
      success: false,
      error: 'Team not found'
    });
  }

  // Check if user is the team admin
  const isAdmin = team.members.some(
    member => member.user.toString() === req.user._id.toString() && member.role === 'admin'
  );

  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to remove members from this team'
    });
  }

  // Check if member exists
  const memberIndex = team.members.findIndex(
    member => member._id.toString() === req.params.memberId
  );

  if (memberIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Member not found in this team'
    });
  }

  // Remove member
  team.members.splice(memberIndex, 1);
  await team.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Update team member role
// @route   PUT /api/v1/teams/:id/members/:memberId
// @access  Private
exports.updateMemberRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  
  const team = await Team.findById(req.params.id);

  if (!team) {
    return res.status(404).json({
      success: false,
      error: 'Team not found'
    });
  }

  // Check if user is the team admin
  const isAdmin = team.members.some(
    member => member.user.toString() === req.user._id.toString() && member.role === 'admin'
  );

  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to update member roles in this team'
    });
  }

  // Find and update member role
  const member = team.members.id(req.params.memberId);
  if (!member) {
    return res.status(404).json({
      success: false,
      error: 'Member not found in this team'
    });
  }

  member.role = role;
  await team.save();

  res.status(200).json({
    success: true,
    data: team
  });
});
