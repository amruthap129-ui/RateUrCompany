const express = require('express');
const router = express.Router();

// Mock payment handler (simulates PayPal/Stripe)
router.post('/process', async (req, res) => {
  const { company_name, amount, payment_method } = req.body;
  if (req.body.simulate_down) {
  return res.status(503).json({ success: false, message: 'Payment service unavailable (simulated)' });
    }

  try {
    if (!company_name || !amount) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    // Simulate payment logic
    if (payment_method === 'stripe') {
      // Mock a success scenario
      const transaction_id = 'TXN' + Math.floor(Math.random() * 1000000);
      console.log(`💰 Payment processed for ${company_name} via ${payment_method} - ₹${amount}`);
      return res.status(200).json({
        success: true,
        company_name,
        amount,
        provider: payment_method,
        transaction_id
      });
    } else {
      return res.status(400).json({ success: false, message: 'Unsupported payment method' });
    }
  } catch (err) {
    console.error('Payment processing error:', err);
    return res.status(503).json({ success: false, message: 'Payment service unavailable' });
  }
  
  
});

module.exports = router;
