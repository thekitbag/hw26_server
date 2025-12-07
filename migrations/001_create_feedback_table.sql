-- Migration: Create feedback table
-- Description: Core table for storing customer feedback submissions

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id VARCHAR(255) NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ip_address INET,
  user_agent TEXT
);

-- Index for efficient location-based queries
CREATE INDEX IF NOT EXISTS idx_feedback_location_id ON feedback(location_id);

-- Index for time-based queries (analytics)
CREATE INDEX IF NOT EXISTS idx_feedback_submitted_at ON feedback(submitted_at);

-- Index for created_at (audit/debugging)
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at);
