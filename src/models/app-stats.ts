import mongoose from 'mongoose';

const AppStatsSchema = new mongoose.Schema(
  {
    totalDownloads: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const AppStats = mongoose.models.AppStats || mongoose.model('AppStats', AppStatsSchema);

export default AppStats;
