import { useState, useEffect } from 'react';
import { apiClient, HackathonFilters, HackathonStats } from '../api/client';
import { Hackathon } from '../types/hackathon';

export function useHackathons(filters: HackathonFilters = {}) {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getHackathons(filters);
        setHackathons(response.hackathons);
        setTotal(response.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch hackathons');
        console.error('Error fetching hackathons:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, [JSON.stringify(filters)]);

  return { hackathons, total, loading, error };
}

export function useHackathon(id: string) {
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getHackathon(id);
        setHackathon(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch hackathon');
        console.error('Error fetching hackathon:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHackathon();
    }
  }, [id]);

  return { hackathon, loading, error };
}

export function useHackathonStats() {
  const [stats, setStats] = useState<HackathonStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getHackathonStats();
        setStats(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}