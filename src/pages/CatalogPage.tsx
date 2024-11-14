import React, { useEffect, useState } from 'react';
import { productsCatalog } from '../interfaces/ProductsCatalog';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../states/cartSlice';
import { Pagination } from 'react-bootstrap';

const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<productsCatalog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1); 
  const dispatch = useDispatch();

  const fetchProducts = async (page: number) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/catalogo?page=${page}&pageSize=20`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Error al cargar los productos');
      const data = await response.json();
      setProducts(data.products || []); 
      setTotalPages(data.totalPages || 1); 
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ha ocurrido un error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handleQuantityChange = (productId: number, increment: boolean) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: Math.max(1, (prevQuantities[productId] || 1) + (increment ? 1 : -1)),
    }));
  };

  const handleAddToCart = (product: productsCatalog) => {
    const quantity = quantities[product.id] || 1;
    dispatch(addToCart({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagen: product.imagen,
      descripcion: product.descripcion,
      cantidad: quantity,
      unidadesVendidas: product.unidadesVendidas,
      puntuacion: product.puntuacion,
      familia: product.familia || '', 
      fotoperiodo: product.fotoperiodo || '',
      tipoRiego: product.tipoRiego || '',
      petFriendly: product.petFriendly || false,
      color: product.color || '',
      ancho: product.ancho,
      alto: product.alto,
      largo: product.largo,
      peso: product.peso,
    }));
  };
  

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="catalog-container">
      <div className="products-grid">
        {/* Solo intenta renderizar si 'products' es un array válido */}
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={`https://placehold.co/300x200?text=${encodeURIComponent(product.nombre)}&font=roboto`}
                alt={product.nombre}
                className="product-image"
              />
              <h3>{product.nombre}</h3>
              <p className="product-price">Precio: ${product.precio}</p>
              <div className="quantity-controls">
                <button onClick={() => handleQuantityChange(product.id, false)}>-</button>
                <span>{quantities[product.id] || 1}</span>
                <button onClick={() => handleQuantityChange(product.id, true)}>+</button>
              </div>
              <button onClick={() => handleAddToCart(product)}>Añadir al carrito</button>
              <Link to={`/catalogo/producto/${product.id}`}>Ver detalle</Link>
            </div>
          ))
        ) : (
          <p>No se encontraron productos.</p>
        )}
      </div>
      <Pagination>
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};

export default CatalogPage;

