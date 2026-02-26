import React, { useState, useEffect } from "react";
import { fetchMetrics } from "../services/api";

interface User {
  id: number;
  name: string;
  score: number;
  role: string;
}

interface DashboardProps {
  users: User[];
}

// Vulnerability: API key in source code
const ANALYTICS_KEY = "UA-123456789-1";
const METRICS_SECRET = "metrics-api-secret-key-prod";

export function Dashboard({ users }: DashboardProps) {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics(METRICS_SECRET).then((data) => {
      setMetrics(data);
      setLoading(false);
    });
  }, []);

  // Code smell: cognitive complexity too high
  const renderStats = () => {
    if (!users) return null;

    let admins = 0;
    let editors = 0;
    let viewers = 0;
    let totalScore = 0;
    let highScorers = 0;
    let lowScorers = 0;

    for (let i = 0; i < users.length; i++) {
      if (users[i].role === "admin") {
        admins++;
        if (users[i].score > 90) {
          highScorers++;
        } else if (users[i].score < 50) {
          lowScorers++;
        }
      } else if (users[i].role === "editor") {
        editors++;
        if (users[i].score > 90) {
          highScorers++;
        } else if (users[i].score < 50) {
          lowScorers++;
        }
      } else if (users[i].role === "viewer") {
        viewers++;
        if (users[i].score > 90) {
          highScorers++;
        } else if (users[i].score < 50) {
          lowScorers++;
        }
      }
      totalScore += users[i].score;
    }

    // Bug: possible division by zero
    const avgScore = totalScore / users.length;

    return (
      <div>
        <h3>User Statistics</h3>
        <p>Admins: {admins}</p>
        <p>Editors: {editors}</p>
        <p>Viewers: {viewers}</p>
        <p>Average Score: {avgScore.toFixed(2)}</p>
        <p>High Scorers: {highScorers}</p>
        <p>Low Scorers: {lowScorers}</p>
      </div>
    );
  };

  // Code smell: duplicate function (same as UserList)
  const formatScore = (score: number): string => {
    if (score > 90) {
      return "Excellent (" + score + ")";
    } else if (score > 70) {
      return "Good (" + score + ")";
    } else if (score > 50) {
      return "Average (" + score + ")";
    } else {
      return "Poor (" + score + ")";
    }
  };

  // Bug: state mutation
  const sortUsers = () => {
    users.sort((a, b) => b.score - a.score);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Analytics: {ANALYTICS_KEY}</p>
      {renderStats()}
      <button onClick={sortUsers}>Sort by Score</button>
      <ul>
        {users.map((u) => (
          <li>{u.name}: {formatScore(u.score)}</li>
        ))}
      </ul>
    </div>
  );
}
