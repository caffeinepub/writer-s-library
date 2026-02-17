import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Category, Writing, UserProfile, Status, WritingState } from '../backend';
import { queryKeys } from './queryKeys';

// Public queries
export function usePublicCategories() {
  const { actor, isFetching } = useActor();

  return useQuery<Category[]>({
    queryKey: queryKeys.publicCategories,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveChildCategories(null);
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePublishedWritings() {
  const { actor, isFetching } = useActor();

  return useQuery<Writing[]>({
    queryKey: queryKeys.publishedWritings,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublishedWritings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useWriting(id: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Writing | null>({
    queryKey: queryKeys.writing(id),
    queryFn: async () => {
      if (!actor || !id) return null;
      try {
        return await actor.getWriting(id);
      } catch (error) {
        console.error('Error fetching writing:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCategory(id: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Category | null>({
    queryKey: queryKeys.category(id),
    queryFn: async () => {
      if (!actor || !id) return null;
      try {
        return await actor.getCategory(id);
      } catch (error) {
        console.error('Error fetching category:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

// Admin queries
export function useAdminCategories() {
  const { actor, isFetching } = useActor();

  return useQuery<Category[]>({
    queryKey: queryKeys.adminCategories,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCategories(null);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminWritings() {
  const { actor, isFetching } = useActor();

  return useQuery<Writing[]>({
    queryKey: queryKeys.adminWritings,
    queryFn: async () => {
      if (!actor) return [];
      // Get all writings (admin can see drafts)
      return actor.getPublishedWritings();
    },
    enabled: !!actor && !isFetching,
  });
}

// Admin mutations
export function useCreateCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      parentCategoryId: bigint | null;
      supportedLanguages: string[];
      focusBannerUrl: string;
      status: Status;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCategory(
        data.title,
        data.parentCategoryId,
        data.supportedLanguages,
        data.focusBannerUrl,
        data.status
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminCategories });
      queryClient.invalidateQueries({ queryKey: queryKeys.publicCategories });
    },
  });
}

export function useUpdateCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      parentCategoryId: bigint | null;
      supportedLanguages: string[];
      focusBannerUrl: string;
      status: Status;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCategory(
        data.id,
        data.title,
        data.parentCategoryId,
        data.supportedLanguages,
        data.focusBannerUrl,
        data.status
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminCategories });
      queryClient.invalidateQueries({ queryKey: queryKeys.publicCategories });
      queryClient.invalidateQueries({ queryKey: queryKeys.category(variables.id) });
    },
  });
}

export function useDeleteCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminCategories });
      queryClient.invalidateQueries({ queryKey: queryKeys.publicCategories });
    },
  });
}

export function useCreateWriting() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      categoryIds: bigint[];
      content: string;
      contentWarnings: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitWriting(
        data.title,
        data.categoryIds,
        data.content,
        data.contentWarnings
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminWritings });
    },
  });
}

export function useUpdateWriting() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      content: string;
      categoryIds: bigint[];
      contentWarnings: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateWriting(
        data.id,
        data.title,
        data.content,
        data.categoryIds,
        data.contentWarnings
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminWritings });
      queryClient.invalidateQueries({ queryKey: queryKeys.publishedWritings });
      queryClient.invalidateQueries({ queryKey: queryKeys.writing(variables.id) });
    },
  });
}

export function usePublishWriting() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.publishWriting(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminWritings });
      queryClient.invalidateQueries({ queryKey: queryKeys.publishedWritings });
      queryClient.invalidateQueries({ queryKey: queryKeys.writing(id) });
    },
  });
}

export function useUnpublishWriting() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.unpublishWriting(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminWritings });
      queryClient.invalidateQueries({ queryKey: queryKeys.publishedWritings });
      queryClient.invalidateQueries({ queryKey: queryKeys.writing(id) });
    },
  });
}

export function useDeleteWriting() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteWriting(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminWritings });
      queryClient.invalidateQueries({ queryKey: queryKeys.publishedWritings });
    },
  });
}

// User profile queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: queryKeys.currentUserProfile,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUserProfile });
    },
  });
}

// Admin status
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: queryKeys.isAdmin,
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}
