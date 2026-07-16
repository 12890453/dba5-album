import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { HomePage } from '@/pages/Home';
import { AlbumsPage } from '@/pages/Albums';
import { AlbumDetailPage } from '@/pages/AlbumDetail';
import { DirectoryPage } from '@/pages/Directory';
import { ProfilePage } from '@/pages/Profile';
import { TimelinePage } from '@/pages/Timeline';
import { MessagesPage } from '@/pages/Messages';
import { VideosPage } from '@/pages/Videos';
import { DownloadsPage } from '@/pages/Downloads';
import { LoginPage } from '@/pages/Login';
import { AdminDashboard } from '@/pages/admin/Dashboard';
import { AlbumManager } from '@/pages/admin/AlbumManager';
import { UserManager } from '@/pages/admin/UserManager';
import { PhotoManager } from '@/pages/admin/PhotoManager';
import { ContentManager } from '@/pages/admin/ContentManager';
import { MaterialManager } from '@/pages/admin/MaterialManager';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'albums', element: <AlbumsPage /> },
      { path: 'albums/:albumId', element: <AlbumDetailPage /> },
      { path: 'directory', element: <DirectoryPage /> },
      { path: 'profile/:userId', element: <ProfilePage /> },
      { path: 'timeline', element: <TimelinePage /> },
      { path: 'messages', element: <MessagesPage /> },
      { path: 'videos', element: <VideosPage /> },
      { path: 'downloads', element: <DownloadsPage /> },
      { path: 'login', element: <LoginPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'albums', element: <AlbumManager /> },
      { path: 'users', element: <UserManager /> },
      { path: 'photos', element: <PhotoManager /> },
      { path: 'content', element: <ContentManager /> },
      { path: 'materials', element: <MaterialManager /> },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
