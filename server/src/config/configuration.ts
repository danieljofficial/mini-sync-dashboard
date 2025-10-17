export default () => ({
  port: parseInt(process.env.PORT as string, 10) || 5000,
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/sync-dashboard',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
});
