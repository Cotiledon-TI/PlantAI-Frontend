import React from 'react';
import { Modal, Button, Image } from 'react-bootstrap';  // Asegúrate de importar 'Image' desde react-bootstrap
import { ProductAdmin } from '../interfaces/ProductAdmin';
import "../styles/DeleteProductModal.css";

interface DeleteProductModalProps {
  show: boolean; 
  product: ProductAdmin | null; 
  onClose: () => void;
  onDelete: (productId: number) => void;
}

const DeleteProductModal: React.FC<DeleteProductModalProps> = ({ show, product, onClose, onDelete }) => {
  // Asegúrate de que el producto esté disponible
  if (!product) return null; // Si el producto es null, no mostrar el modal

  const handleDelete = () => {
    onDelete(product.id); // Llamamos a la función onDelete con el ID del producto
  };

  // Obtener la primera imagen del array 'imagenes'
  const firstImage = product.imagenes && product.imagenes.length > 0 ? product.imagenes[0].ruta : null;

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>¿Está seguro de eliminar este producto?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{product?.nombre}</p>
        <p>{product?.SKU}</p>
        {firstImage ? (
          <div className="product-image-modal">
            <Image src={firstImage} alt={product.nombre} fluid rounded />
          </div>
        ) : (
          <p>No se encontró imagen del producto</p>
        )}
      </Modal.Body>
      <Modal.Footer className='d-flex justify-content-center'>
        <Button variant="outline-primary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleDelete}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteProductModal;