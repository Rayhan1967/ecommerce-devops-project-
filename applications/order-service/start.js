require('dotenv').config();
const app = require('./server');
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`🚀 Order Service running on port ${PORT}`));
