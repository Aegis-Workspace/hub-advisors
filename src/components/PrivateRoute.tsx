import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../pages/@types/general';
import { jwtDecode } from 'jwt-decode';

interface PrivateRouteProps {
  children: React.ReactNode;
  role?: Role;
}

export default function PrivateRoute({ children, role }: PrivateRouteProps) {
  const { usuario } = useAuth();

  let parsedUsuario = usuario;

  if (!parsedUsuario) {
    const storedToken = localStorage.getItem('@Investimentos:token');

    if (storedToken) {
      try {
        const decoded = jwtDecode<any>(storedToken);
        parsedUsuario = decoded;
      } catch (error) {
        console.error('Token inválido:', error);
        return <Navigate to="/login" />;
      }
    }
  }

  if (!parsedUsuario) {
    return <Navigate to="/login" />;
  }

  if (role && parsedUsuario.role !== role) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
}
