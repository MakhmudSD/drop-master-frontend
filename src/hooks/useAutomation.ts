import { GET_AUTOMATION, GET_AUTOMATION_LOGS, GET_AUTOMATION_STATS } from '@/lib/apollo/queries';
import { UPDATE_AUTOMATION, START_AUTOMATION, STOP_AUTOMATION, RESET_AUTOMATION } from '@/lib/apollo/mutations';
import { UseAutomationResult } from '@/lib/hooks.types';
import { useMutation, useQuery } from '@apollo/client/react';
import { Automation } from '@/types';

export const useAutomation = (): UseAutomationResult => {
  const { data, loading, error, refetch } = useQuery<{ automation: Automation }>(GET_AUTOMATION, {
    errorPolicy: 'all'
  });

  const [updateAutomationMutation] = useMutation(UPDATE_AUTOMATION, {
    refetchQueries: [GET_AUTOMATION]
  });

  const [startAutomationMutation] = useMutation(START_AUTOMATION, {
    refetchQueries: [GET_AUTOMATION]
  });

  const [stopAutomationMutation] = useMutation(STOP_AUTOMATION, {
    refetchQueries: [GET_AUTOMATION]
  });

  const [resetAutomationMutation] = useMutation(RESET_AUTOMATION, {
    refetchQueries: [GET_AUTOMATION]
  });

  const updateAutomation = async (settings: any, isActive?: boolean) => {
    try {
      const { data } = await updateAutomationMutation({
        variables: { settings, isActive }
      });
      return data;
    } catch (error) {
      console.error('Update automation error:', error);
      throw error;
    }
  };

  return {
    automation: data?.automation || null,
    loading,
    error,
    updateAutomation
  };
};

export const useAutomationLogs = (limit?: number, offset?: number) => {
  const { data, loading, error, refetch } = useQuery<{ automationLogs: Automation[] }>(GET_AUTOMATION_LOGS, {
    variables: {
      limit: limit || 20,
      offset: offset || 0
    },
    errorPolicy: 'all'
  });

  return {
    logs: data?.automationLogs || [],
    loading,
    error,
    refetch
  };
};

export const useAutomationStats = () => {
  const { data, loading, error, refetch } = useQuery<{ automationStats: Automation }>(GET_AUTOMATION_STATS, {
    errorPolicy: 'all'
  });

  return {
    stats: data?.automationStats || null,
    loading,
    error,
    refetch
  };
};
