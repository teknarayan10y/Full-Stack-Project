import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import './LoyaltyProgram.css';

const LoyaltyProgram = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [redeemPoints, setRedeemPoints] = useState(100);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchLoyaltyData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const loyaltyResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/loyalty`, {
          headers: { 'x-auth-token': token }
        });
        
        const historyResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/loyalty/history`, {
          headers: { 'x-auth-token': token }
        });
        
        if (loyaltyResponse.data.success) {
          setLoyaltyData(loyaltyResponse.data.data);
        }
        
        if (historyResponse.data.success) {
          setPointsHistory(historyResponse.data.data);
        }
      } catch (err) {
        console.error('Error fetching loyalty data:', err);
        setError('Failed to load loyalty program data. Please try again later.');
        toast.error('Failed to load loyalty program data');
      } finally {
        setLoading(false);
      }
    };

    fetchLoyaltyData();
  }, [isAuthenticated, navigate]);

  const handleRedeemPoints = async () => {
    if (!loyaltyData || loyaltyData.points < redeemPoints) {
      toast.error('Not enough points to redeem');
      return;
    }

    try {
      setRedeeming(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/loyalty/redeem`,
        { points: redeemPoints },
        { headers: { 'x-auth-token': token } }
      );
      
      if (response.data.success) {
        toast.success(`Successfully redeemed ${redeemPoints} points!`);
        setLoyaltyData({
          ...loyaltyData,
          points: response.data.data.remainingPoints
        });
        
        // Add the redemption to the history
        setPointsHistory([
          {
            points: -redeemPoints,
            description: `Redeemed for discount code ${response.data.data.discountCode}`,
            date: new Date()
          },
          ...pointsHistory
        ]);
        
        // Show the discount code
        toast.info(`Your discount code: ${response.data.data.discountCode}`);
      }
    } catch (err) {
      console.error('Error redeeming points:', err);
      toast.error('Failed to redeem points. Please try again later.');
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) {
    return (
      <div className="loyalty-program-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loyalty-program-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="loyalty-program-container">
      <h1>Loyalty Rewards Program</h1>
      
      {loyaltyData && (
        <div className="loyalty-card">
          <div className="loyalty-card-header">
            <h2>{user.name}'s Rewards</h2>
            <div className={`loyalty-tier ${loyaltyData.tier.toLowerCase()}`}>
              {loyaltyData.tier} Member
            </div>
          </div>
          
          <div className="loyalty-card-body">
            <div className="points-display">
              <span className="points-value">{loyaltyData.points}</span>
              <span className="points-label">Points</span>
            </div>
            
            <div className="member-since">
              Member since: {new Date(loyaltyData.memberSince).toLocaleDateString()}
            </div>
            
            <div className="tier-benefits">
              <h3>Your {loyaltyData.tier} Benefits:</h3>
              <ul>
                {loyaltyData.tier === 'Bronze' && (
                  <>
                    <li>Earn 1 point for every $10 spent</li>
                    <li>Redeem points for discounts</li>
                  </>
                )}
                {loyaltyData.tier === 'Silver' && (
                  <>
                    <li>Earn 1.2 points for every $10 spent</li>
                    <li>Redeem points for discounts</li>
                    <li>Early check-in when available</li>
                  </>
                )}
                {loyaltyData.tier === 'Gold' && (
                  <>
                    <li>Earn 1.5 points for every $10 spent</li>
                    <li>Redeem points for discounts</li>
                    <li>Early check-in when available</li>
                    <li>Room upgrades when available</li>
                  </>
                )}
                {loyaltyData.tier === 'Platinum' && (
                  <>
                    <li>Earn 2 points for every $10 spent</li>
                    <li>Redeem points for discounts</li>
                    <li>Guaranteed early check-in</li>
                    <li>Room upgrades when available</li>
                    <li>Free breakfast</li>
                  </>
                )}
              </ul>
            </div>
            
            <div className="redeem-section">
              <h3>Redeem Points</h3>
              <p>Exchange your points for discount codes on future bookings.</p>
              <div className="redeem-controls">
                <input
                  type="number"
                  min="100"
                  max={loyaltyData.points}
                  step="100"
                  value={redeemPoints}
                  onChange={(e) => setRedeemPoints(parseInt(e.target.value))}
                />
                <button 
                  onClick={handleRedeemPoints} 
                  disabled={redeeming || loyaltyData.points < redeemPoints}
                >
                  {redeeming ? 'Processing...' : `Redeem ${redeemPoints} Points`}
                </button>
              </div>
              <p className="redeem-info">
                {redeemPoints} points = ${(redeemPoints * 0.1).toFixed(2)} discount
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="points-history-section">
        <h2>Points History</h2>
        {pointsHistory.length === 0 ? (
          <p>No points history yet. Start booking to earn points!</p>
        ) : (
          <table className="points-history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {pointsHistory.map((item, index) => (
                <tr key={index}>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>{item.description}</td>
                  <td className={item.points > 0 ? 'points-earned' : 'points-spent'}>
                    {item.points > 0 ? `+${item.points}` : item.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="loyalty-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-item">
          <h3>How do I earn points?</h3>
          <p>You earn points automatically when you make a booking. You'll receive 1 point for every $10 spent on bookings.</p>
        </div>
        <div className="faq-item">
          <h3>How do I reach the next tier?</h3>
          <p>Tiers are based on your total points earned:</p>
          <ul>
            <li>Bronze: 0-199 points</li>
            <li>Silver: 200-499 points</li>
            <li>Gold: 500-999 points</li>
            <li>Platinum: 1000+ points</li>
          </ul>
        </div>
        <div className="faq-item">
          <h3>How do I redeem my points?</h3>
          <p>You can redeem your points for discount codes on this page. Each point is worth $0.10 in discounts.</p>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyProgram;
