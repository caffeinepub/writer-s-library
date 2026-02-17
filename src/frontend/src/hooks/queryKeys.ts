export const queryKeys = {
  publicCategories: ['publicCategories'] as const,
  publishedWritings: ['publishedWritings'] as const,
  writing: (id: bigint | null) => ['writing', id?.toString()] as const,
  category: (id: bigint | null) => ['category', id?.toString()] as const,
  adminCategories: ['adminCategories'] as const,
  adminWritings: ['adminWritings'] as const,
  currentUserProfile: ['currentUserProfile'] as const,
  isAdmin: ['isAdmin'] as const,
};
