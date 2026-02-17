import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import WritingDetailPage from './pages/WritingDetailPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminCategoryEditorPage from './pages/admin/AdminCategoryEditorPage';
import AdminWritingsPage from './pages/admin/AdminWritingsPage';
import AdminWritingEditorPage from './pages/admin/AdminWritingEditorPage';
import SiteLayout from './components/layout/SiteLayout';
import AdminLayout from './components/layout/AdminLayout';
import AdminRouteGuard from './components/auth/AdminRouteGuard';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

function RootComponent() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SiteLayout>
        <Outlet />
      </SiteLayout>
      <Toaster />
    </ThemeProvider>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const categoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/category/$categoryId',
  component: CategoryPage,
});

const writingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/writing/$writingId',
  component: WritingDetailPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminRouteGuard>
      <AdminLayout>
        <AdminDashboardPage />
      </AdminLayout>
    </AdminRouteGuard>
  ),
});

const adminCategoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/categories',
  component: () => (
    <AdminRouteGuard>
      <AdminLayout>
        <AdminCategoriesPage />
      </AdminLayout>
    </AdminRouteGuard>
  ),
});

const adminCategoryEditorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/categories/$categoryId',
  component: () => (
    <AdminRouteGuard>
      <AdminLayout>
        <AdminCategoryEditorPage />
      </AdminLayout>
    </AdminRouteGuard>
  ),
});

const adminCategoryNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/categories/new',
  component: () => (
    <AdminRouteGuard>
      <AdminLayout>
        <AdminCategoryEditorPage />
      </AdminLayout>
    </AdminRouteGuard>
  ),
});

const adminWritingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/writings',
  component: () => (
    <AdminRouteGuard>
      <AdminLayout>
        <AdminWritingsPage />
      </AdminLayout>
    </AdminRouteGuard>
  ),
});

const adminWritingEditorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/writings/$writingId',
  component: () => (
    <AdminRouteGuard>
      <AdminLayout>
        <AdminWritingEditorPage />
      </AdminLayout>
    </AdminRouteGuard>
  ),
});

const adminWritingNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/writings/new',
  component: () => (
    <AdminRouteGuard>
      <AdminLayout>
        <AdminWritingEditorPage />
      </AdminLayout>
    </AdminRouteGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  categoryRoute,
  writingRoute,
  adminRoute,
  adminCategoriesRoute,
  adminCategoryEditorRoute,
  adminCategoryNewRoute,
  adminWritingsRoute,
  adminWritingEditorRoute,
  adminWritingNewRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
