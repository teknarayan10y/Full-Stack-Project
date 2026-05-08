import React, { useState, useEffect } from "react";
import { Paper, Button, TextField, Grid, Typography, Input, Box } from "@mui/material";
import axios from 'axios';

const LostAndFound = () => {
  const [item, setItem] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [comment, setComment] = useState(""); // State for comment
  const [foundItems, setFoundItems] = useState([]);

  // Fetch Found Items on Component Mount
  useEffect(() => {
    const fetchFoundItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/found-items');
        setFoundItems(response.data);
      } catch (error) {
        console.error('Error fetching found items:', error);
      }
    };

    fetchFoundItems();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file); // Convert the image to base64 URL
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("item", item);
      formData.append("description", description);
      formData.append("location", location);
      if (image) {
        const blob = await fetch(image).then((res) => res.blob());
        formData.append("image", blob, "lost-item.jpg");
      }

      // Make the POST request to submit the item
      const response = await axios.post("http://localhost:5000/submit-lost-item", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Logging the response for success
      console.log("Item submitted successfully:", response.data);

      // Update found items in the state with the newly submitted item
      const newItem = response.data;

      // Prepend the new item to the existing found items
      setFoundItems([newItem, ...foundItems]);

      // Reset the input fields
      setItem("");
      setDescription("");
      setLocation("");
      setImage(null);
    } catch (error) {
      console.error("Error submitting item:", error);
    }
  };

  const handleCommentSubmit = async (itemId) => {
    try {
      await axios.post(`http://localhost:5000/add-comment/${itemId}`, { comment });
      // After adding a comment, fetch the updated found items
      const response = await axios.get('http://localhost:5000/found-items');
      setFoundItems(response.data);
      setComment(""); // Clear comment input
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/delete-item/${itemId}`);
      console.log('Item deleted successfully:', response.data);
    } catch (error) {
      console.error('Error deleting item:', error.response || error.message);
      if (error.response) {
        // Log additional details from the backend response
        console.log('Backend response:', error.response.data);
        console.log('Status code:', error.response.status);
      }
    }
  };
  
  

  return (
    <Paper elevation={3} sx={{ padding: '2rem', marginTop: '2rem', borderRadius: '8px' }}>
      <Typography variant="h4" align="center" sx={{ marginBottom: '1.5rem', color: '#3f51b5' }}>
        Lost and Found
      </Typography>

      {/* Lost Item Submission Form */}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Item"
              variant="outlined"
              fullWidth
              value={item}
              onChange={(e) => setItem(e.target.value)}
              required
              sx={{ background: '#f5f5f5', borderRadius: '4px', boxShadow: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              sx={{ background: '#f5f5f5', borderRadius: '4px', boxShadow: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Location"
              variant="outlined"
              fullWidth
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              sx={{ background: '#f5f5f5', borderRadius: '4px', boxShadow: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              type="file"
              accept="image/*"
              fullWidth
              onChange={handleImageChange}
              sx={{ marginBottom: '1rem', border: '1px dashed #3f51b5', borderRadius: '4px' }}
            />
            {image && <img src={image} alt="Lost item" style={{ width: "100%", height: "auto", marginTop: "1rem", borderRadius: '8px' }} />}
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ padding: '1rem', borderRadius: '8px', fontSize: '1.1rem' }}>
              Submit Lost Item
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Display Found Items */}
      <Typography variant="h5" align="center" sx={{ marginTop: '2rem', color: '#3f51b5' }}>
        Found Items
      </Typography>

      <Grid container spacing={2} sx={{ marginTop: '1rem' }}>
        {foundItems.length > 0 ? (
          foundItems.map((foundItem) => (
            <Grid item xs={12} md={6} key={foundItem._id}>
              <Paper elevation={2} sx={{ padding: '1rem', marginBottom: '1rem', borderRadius: '8px', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                <Typography variant="h6" sx={{ color: '#333' }}>{foundItem.item}</Typography>
                <Typography variant="body1" color="textSecondary">{foundItem.description}</Typography>
                <Typography variant="body2" color="textSecondary">Location: {foundItem.location}</Typography>
                {foundItem.image && <img src={`http://localhost:5000/${foundItem.image}`} alt="Found item" style={{ width: "100%", height: "auto", marginTop: "1rem", borderRadius: '8px' }} />}

                {/* Comment Section */}
                <Box sx={{ marginTop: '1rem' }}>
                  <TextField
                    label="Add a comment"
                    variant="outlined"
                    fullWidth
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    sx={{ marginBottom: '1rem', background: '#f5f5f5', borderRadius: '4px' }}
                  />
                  <Button variant="contained" color="secondary" onClick={() => handleCommentSubmit(foundItem._id)} fullWidth>
                    Submit Comment
                  </Button>

                  {/* Display comments */}
                  {foundItem.comments && foundItem.comments.length > 0 && (
                    <Box sx={{ marginTop: '1rem' }}>
                      {foundItem.comments.map((comment, index) => (
                        <Box
                          key={index}
                          sx={{
                            padding: '0.5rem',
                            backgroundColor: '#f1f1f1',
                            borderRadius: '20px',
                            marginBottom: '1rem',
                            display: 'inline-block',
                            maxWidth: '80%',
                          }}
                        >
                          <Typography variant="body2" color="textSecondary">{comment}</Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>

                {/* Delete Button */}
                <Button 
                  variant="contained" 
                  color="error" 
                  onClick={() => handleDelete(foundItem._id)} 
                  fullWidth 
                  sx={{ marginTop: '1rem', padding: '0.8rem' }}>
                  Got my item
                </Button>
              </Paper>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" align="center" color="textSecondary">
              No items found yet.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default LostAndFound;
