import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbsProps {
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ className = '' }) => {
  const location = useLocation();
  
  // Obtiene la ruta actual y la divide en segmentos
  const pathSegments = location.pathname.split('/').filter(segment => segment !== '');
  
  // Si estamos en la página de inicio, no mostramos breadcrumbs
  if (pathSegments.length === 0) {
    return null;
  }
  
  return (
    <nav aria-label="Breadcrumb" className={`breadcrumbs ${className}`}>
      <div className="flex items-center list-none mt-5">
        {/* Siempre incluye el breadcrumb "Inicio" */}
        <Link to="/" className="text-gray-600 hover:text-blue-800">
          Inicio
        </Link>
        
        {/* Genera los breadcrumbs para cada segmento de la ruta */}
        {pathSegments.map((segment, index) => {
          // Construye la ruta acumulativa
          const path = '/' + pathSegments.slice(0, index + 1).join('/');
          
          // Formatea el texto del segmento (reemplaza guiones por espacios, capitaliza)
          const formattedSegment = segment
            .replace(/-/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
          
          // Es el último breadcrumb (actual)
          const isLast = index === pathSegments.length - 1;
          
          return (
            <React.Fragment key={path}>
              {/* Separador */}
              <span className="mx-2 text-gray-400">/</span>
              
              {isLast ? (
                // El último segmento es el actual (destacado)
                <span 
                  className="font-semibold text-blue-600" 
                  aria-current="page"
                >
                  {formattedSegment}
                </span>
              ) : (
                // Segmentos intermedios son enlaces
                <Link 
                  to={path} 
                  className="text-gray-600 hover:text-blue-800"
                >
                  {formattedSegment}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};

export default Breadcrumbs;