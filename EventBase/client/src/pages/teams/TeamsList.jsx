import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Box,
  Chip,
  useTheme,
  CircularProgress,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Group as GroupIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Event as EventIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const TeamsList = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [teamMenuAnchorEl, setTeamMenuAnchorEl] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/teams');
      setTeams(data.data);
      setFilteredTeams(data.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    let result = Array.isArray(teams) ? [...teams] : [];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      
      // Helper function to check if any value in an array contains the search term
      const arrayContainsTerm = (array, property) => {
        if (!Array.isArray(array)) return false;
        return array.some(item => 
          item && 
          item[property] && 
          String(item[property]).toLowerCase().includes(term)
        );
      };

      result = result.filter(team => {
        if (!team) return false;
        
        // Check direct properties
        const directMatch = (
          (team.name && team.name.toLowerCase().includes(term)) ||
          (team.description && team.description.toLowerCase().includes(term)) ||
          (team.location && team.location.toLowerCase().includes(term)) ||
          (team.category && team.category.toLowerCase().includes(term))
        );

        // Check tags
        const tagMatch = Array.isArray(team.tags) && 
          team.tags.some(tag => tag && tag.toLowerCase().includes(term));

        // Check members
        const memberMatch = arrayContainsTerm(team.members, 'name') || 
                          arrayContainsTerm(team.members, 'email');

        // Check events
        const eventMatch = arrayContainsTerm(team.events, 'title') || 
                          arrayContainsTerm(team.events, 'description') ||
                          arrayContainsTerm(team.events, 'location');

        return directMatch || tagMatch || memberMatch || eventMatch;
      });
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (!a || !b) return 0;
      
      switch(sortBy) {
        case 'name-asc':
          return (a.name || '').localeCompare(b.name || '');
        case 'name-desc':
          return (b.name || '').localeCompare(a.name || '');
        case 'recent':
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });
    
    setFilteredTeams(result);
  }, [teams, searchTerm, sortBy]);

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleMenuOpen = (event, team) => {
    setSelectedTeam(team);
    setTeamMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setTeamMenuAnchorEl(null);
    setSelectedTeam(null);
  };

  const handleSortSelect = (value) => {
    setSortBy(value);
    setSortAnchorEl(null);
  };

  const handleRefresh = () => {
    fetchTeams();
  };

  const handleLeaveTeam = async () => {
    if (!selectedTeam) return;
    
    try {
      await api.delete(`/teams/${selectedTeam._id}/members/me`);
      fetchTeams();
    } catch (error) {
      console.error('Error leaving team:', error);
    } finally {
      handleMenuClose();
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  const teamsToRender = Array.isArray(filteredTeams) ? filteredTeams : [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          My Teams
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{ mr: 2 }}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<GroupIcon />}
            onClick={() => navigate('/teams/new')}
          >
            Create Team
          </Button>
        </Box>
      </Box>

      {/* Search and Filter Bar */}
      <Box 
        display="flex" 
        gap={2} 
        mb={4}
        flexDirection={{ xs: 'column', sm: 'row' }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search teams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: { sm: 400 },
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleFilterClick}
            sx={{ borderRadius: 2 }}
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            startIcon={<SortIcon />}
            onClick={handleSortClick}
            sx={{ borderRadius: 2 }}
          >
            Sort
          </Button>
         
        </Box>
      </Box>

      {/* Sort Menu */}
      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={() => setSortAnchorEl(null)}
      >
        <MenuItem onClick={() => handleSortSelect('recent')}>
          Most Recent
        </MenuItem>
        <MenuItem onClick={() => handleSortSelect('name-asc')}>
          Name (A-Z)
        </MenuItem>
        <MenuItem onClick={() => handleSortSelect('name-desc')}>
          Name (Z-A)
        </MenuItem>
      </Menu>

      {/* Team Actions Menu */}
      <Menu
        id="team-actions-menu"
        anchorEl={teamMenuAnchorEl}
        open={Boolean(teamMenuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {selectedTeam?.createdBy === currentUser?._id ? (
          [
            <MenuItem key="edit" onClick={() => {
              handleMenuClose();
              navigate(`/teams/${selectedTeam._id}/edit`);
            }}>
              Edit Team
            </MenuItem>,
            <MenuItem key="manage" onClick={() => {
              handleMenuClose();
              navigate(`/teams/${selectedTeam._id}/members`);
            }}>
              Manage Members
            </MenuItem>,
            <Divider key="divider" />,
            <MenuItem 
              key="delete"
              onClick={() => {
                handleMenuClose();
                handleLeaveTeam();
              }}
              sx={{ color: 'error.main' }}
            >
              Delete Team
            </MenuItem>
          ]
        ) : (
          <MenuItem 
            onClick={() => {
              handleMenuClose();
              handleLeaveTeam();
            }}
            sx={{ color: 'error.main' }}
          >
            Leave Team
          </MenuItem>
        )}
      </Menu>

      {teamsToRender.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="300px"
          textAlign="center"
          p={4}
          sx={{
            border: `2px dashed ${theme.palette.divider}`,
            borderRadius: 2,
          }}
        >
          <GroupIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {searchTerm ? 'No matching teams found' : 'No teams available at the moment'}
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            {searchTerm 
              ? 'Try adjusting your search or filters'
              : 'No teams available at the moment'}
          </Typography>
          {!searchTerm && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<GroupIcon />}
              onClick={() => navigate('/teams/new')}
            >
              Create Team
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {teamsToRender.map((team) => (
            <Grid item xs={12} sm={6} md={4} key={team._id}>
              <Card 
                variant="outlined"
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 3,
                  },
                }}
                onClick={() => navigate(`/teams/${team._id}`)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar 
                      sx={{ 
                        width: 56, 
                        height: 56, 
                        mr: 2,
                        bgcolor: 'primary.main',
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {team.name?.charAt(0)?.toUpperCase() || 'T'}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="div" noWrap>
                        {team.name}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                        <Chip 
                          icon={<GroupIcon fontSize="small" />}
                          label={`${team.members?.length || 0} ${team.members?.length === 1 ? 'member' : 'members'}`}
                          size="small"
                          variant="outlined"
                        />
                        {team.events?.length > 0 && (
                          <Chip 
                            icon={<EventIcon fontSize="small" />}
                            label={`${team.events.length} ${team.events.length === 1 ? 'event' : 'events'}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>

                  {team.description && (
                    <Box sx={{ mb: 2 }}>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          mb: 1
                        }}
                      >
                        {team.description}
                      </Typography>
                    </Box>
                  )}

                  {team.tags?.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                      {team.tags.slice(0, 3).map((tag, index) => (
                        <Chip 
                          key={index} 
                          label={tag} 
                          size="small" 
                          variant="outlined"
                          color="primary"
                        />
                      ))}
                      {team.tags.length > 3 && (
                        <Chip 
                          label={`+${team.tags.length - 3}`} 
                          size="small" 
                          variant="outlined"
                        />
                      )}
                    </Box>
                  )}

                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mt: 2,
                    pt: 1,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <Typography variant="caption" color="text.secondary">
                      {team.createdAt ? new Date(team.createdAt).toLocaleDateString() : ''}
                    </Typography>
                    <Button 
                      size="small" 
                      variant="text"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/teams/${team._id}`);
                      }}
                      sx={{ minWidth: 'auto' }}
                    >
                      View
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default TeamsList;
