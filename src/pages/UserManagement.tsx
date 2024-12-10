import { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Button,
  Spinner,
  Container,
  Row,
  Col,
  Form,
  Modal,
} from "react-bootstrap";
import UserCreateForm from "./UserCreateForm";
import CardUser from "../components/CardUser";
import UserTable from "../components/UserTable";
import { User } from "../types/types";
import CustomPagination from "../components/CustomPagination";
import AdminSideBar from "../components/AdminSideBar";
import UserGreeting from "../components/UserGreeting";
import "../styles/UserManagementStyle.css"

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const usersPerPage = 6;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user && user.roles && user.roles.includes("admin-1")) {
      setIsAdmin(true);
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/usuarios");
      if (!response.ok) {
        throw new Error("Error al obtener los usuarios");
      }
      const responseData = await response.json();
      console.log("Estructura de responseData:", responseData);
      if (!Array.isArray(responseData.data)) {
        console.error("El campo 'data' no es un array:", responseData.data);
      }

      const data: User[] = Array.isArray(responseData.data) ? responseData.data : [];
      setUsers(data);
    } catch (error) {
      console.error("Error:", error);
      setError("Error al obtener los usuarios");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/usuarios/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar el usuario");
      }
      console.log("Usuario eliminado");
      fetchUsers();
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      setError("Error al eliminar el usuario");
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleModifyClick = () => {
    if (selectedUser) {
      setEditingUser({ ...selectedUser });
    }
  };


  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch(
        `http://localhost:8080/usuarios/${editingUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingUser),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el usuario");
      }

      console.log("Usuario actualizado");
      fetchUsers();
      setEditingUser(null);
      setError("");
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      setError("Error al actualizar el usuario");
    }
  };

  const handleSaveChangesClick = () => {
    setModalAction("modify");
    setShowModal(true);
  };

  const handleDeleteUserClick = () => {
    setModalAction("delete");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmAction = () => {
    if (modalAction === "modify") {
      handleUpdateUser();
    } else if (modalAction === "delete" && selectedUser) {
      deleteUser(selectedUser.id);
    }
    setShowModal(false);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = Array.isArray(users)
  ? users.slice(indexOfFirstUser, indexOfLastUser)
  : [];


  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const userRoles = [
    { id: 1, name: "Super Admin" },
    { id: 2, name: "Admin" },
    { id: 3, name: "Cliente" },
    { id: 4, name: "Visitante" },
  ];

  const handleConfirmSaveChanges = () => {
    if (editingUser) {
      handleUpdateUser();
      setShowModal(false);
    } else {
      console.error("No hay un usuario seleccionado para modificar.");
    }
  };
// 
// currentUsers
  return (
    <Container fluid className="mt-4" style={{}}>
       <Col md={12}>
        <UserGreeting/>
      </Col>
      
      <Row>
        <Col>
          <AdminSideBar />
        </Col>

        <Col md={10}>
          <div style={{ marginTop: "10rem", padding: "16px", background: "#F5F5F5", borderRadius: "0px 0px 8px 8px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}>
            <Tabs defaultActiveKey="modificarUsuario" className="custom-tabs mb-3">
              <Tab eventKey="crearUsuario" title="Crear Usuario">
                {isAdmin && <UserCreateForm onUserCreated={fetchUsers} isAdmin={isAdmin} />}
              </Tab>

              <Tab eventKey="eliminarUsuario" title="Eliminar Usuario">
                {loading ? (
                  <Spinner animation="border" variant="primary" />
                ) : (
                  <>
                    {selectedUser && (
                      <CardUser
                        selectedUser={{
                          ...selectedUser,
                          direccion: selectedUser.direccion || "Sin dirección",
                        }}
                      />
                    )}
                    <UserTable
                      users={Array.isArray(users) ? users : []} 
                      currentUsers={Array.isArray(currentUsers) ? currentUsers : []} 
                      selectedUser={selectedUser ?? null} 
                      setSelectedUser={setSelectedUser} 
                    />

                    {selectedUser && (
                      <div className="d-flex justify-content-center mt-3 gap-2">
                        <Button variant="secondary" onClick={handleCancelEdit}>
                          Cancelar
                        </Button>
                        <Button variant="danger" onClick={handleDeleteUserClick}>
                          Eliminar
                        </Button>
                      </div>
                    )}
                  </>
                )}
                <CustomPagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(users.length / usersPerPage)}
                  paginate={paginate}
                />
              </Tab>

              <Modal show={showModal} onHide={handleCloseModal} centered className="modal-custom">
                <Modal.Header closeButton>
                  <Modal.Title className="modal-title">
                    ¿Está Seguro que desea eliminar Usuario?
                  </Modal.Title>
                </Modal.Header>

                <Modal.Body className="modal-body">
                  <p>Esta acción no podrá deshacerse</p>
                </Modal.Body>

                <Modal.Footer className="modal-footer">
                  <Button variant="danger" onClick={handleConfirmAction} className="modal-btn-danger">
                    Eliminar
                  </Button>
                  <Button variant="secondary" onClick={handleCloseModal} className="modal-btn-secondary">
                    Cancelar
                  </Button>
                </Modal.Footer>
              </Modal>

              <Tab eventKey="modificarUsuario" title="Modificar Usuario">
                {loading ? (
                  <Spinner animation="border" variant="primary" />
                ) : editingUser ? (
                  <>
                    {editingUser && <CardUser selectedUser={editingUser} />}
                    <Form>
                      <Row>
                        <Col>
                          <Form.Group>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                              type="text"
                              value={editingUser.nombre}
                              onChange={(e) =>
                                setEditingUser((prev) =>
                                  prev ? { ...prev, nombre: e.target.value } : null
                                )
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group>
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control
                              type="text"
                              value={editingUser.apellido}
                              onChange={(e) =>
                                setEditingUser((prev) =>
                                  prev ? { ...prev, apellido: e.target.value } : null
                                )
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col>
                          <Form.Group>
                            <Form.Label>Correo Electrónico</Form.Label>
                            <Form.Control
                              type="email"
                              value={editingUser.email}
                              onChange={(e) =>
                                setEditingUser((prev) =>
                                  prev ? { ...prev, email: e.target.value } : null
                                )
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group>
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                              type="text"
                              value={editingUser.telefono}
                              onChange={(e) =>
                                setEditingUser((prev) =>
                                  prev ? { ...prev, telefono: e.target.value } : null
                                )
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col>
                          <Form.Group>
                            <Form.Label>Nombre de Usuario</Form.Label>
                            <Form.Control
                              type="text"
                              value={editingUser.nombreUsuario}
                              onChange={(e) =>
                                setEditingUser((prev) =>
                                  prev ? { ...prev, nombreUsuario: e.target.value } : null
                                )
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group>
                            <Form.Label>Género</Form.Label>
                            <Form.Control
                              type="text"
                              value={editingUser.genero}
                              onChange={(e) =>
                                setEditingUser((prev) =>
                                  prev ? { ...prev, genero: e.target.value } : null
                                )
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col>
                          <Form.Group>
                            <Form.Label>RUT</Form.Label>
                            <Form.Control
                              type="text"
                              value={editingUser.rut}
                              onChange={(e) =>
                                setEditingUser((prev) =>
                                  prev ? { ...prev, rut: e.target.value } : null
                                )
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group>
                            <Form.Label>Fecha de Nacimiento</Form.Label>
                            <Form.Control
                              type="date"
                              value={editingUser.fechaNacimiento}
                              onChange={(e) =>
                                setEditingUser((prev) =>
                                  prev
                                    ? { ...prev, fechaNacimiento: e.target.value }
                                    : null
                                )
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col>
                          <Form.Group>
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                              type="text"
                              value={editingUser.direccion || ""}
                              onChange={(e) =>
                                setEditingUser((prev) =>
                                  prev ? { ...prev, direccion: e.target.value } : null
                                )
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group>
                            <Form.Label>Tipo de Usuario</Form.Label>
                            <Form.Select
                              value={editingUser?.tipoUsuarioId || ""}
                              onChange={(e) =>
                                setEditingUser((prev) =>
                                  prev
                                    ? { ...prev, tipoUsuarioId: parseInt(e.target.value, 10) || 0 }
                                    : null
                                )
                              }
                            >
                              <option value="">Seleccione un tipo de usuario</option>
                              {userRoles.map((role) => (
                                <option key={role.id} value={role.id}>
                                  {role.name}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Form>
                    <div className="d-flex justify-content-center mt-3 gap-2">
                      <Button variant="secondary" onClick={() => setEditingUser(null)}>
                        Cancelar
                      </Button>
                      <Button variant="success" onClick={handleSaveChangesClick}>
                        Guardar Cambios
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {selectedUser ? (
                        <CardUser selectedUser={selectedUser} />
                      ) : (
                        <p>No hay un usuario seleccionado</p>
                      )}
                      <UserTable
                        users={Array.isArray(users) ? users : []} 
                        currentUsers={Array.isArray(currentUsers) ? currentUsers : []} 
                        selectedUser={selectedUser ?? null} 
                        setSelectedUser={setSelectedUser} 
                      />

                    <div className="d-flex justify-content-center mt-3 gap-2" style={{ position: "relative" }}>
                      <Button
                        variant="primary"
                        onClick={handleModifyClick}
                        disabled={!selectedUser}
                        className="btn-modify-position"
                      >
                        Modificar
                      </Button>
                    </div>
                  </>
                )}
                <CustomPagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(users.length / usersPerPage)}
                  paginate={paginate}
                />
              </Tab>
            </Tabs>
          </div>
        </Col>
      </Row>

      {/* Modal Dinámico */}

      <Modal show={showModal} onHide={handleCloseModal} centered style={{ padding: '32px 41px 24px 41px' }}>
        <Modal.Header closeButton style={{ borderBottom: "none", textAlign: "center", alignSelf: 'stretch' }}>
          <Modal.Title
            style={{
              color: "var(--Color1, #1A4756)",
              fontFamily: "Quicksand",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: '700',
              lineHeight: "30px",
            }}
          >
            ¿Está Seguro de Modificar el Usuario?
          </Modal.Title>
        </Modal.Header>

        <Modal.Body
          style={{
            textAlign: "center",
            color: "var(--Color1, #1A4756)",
            fontFamily: "Quicksand",
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "22px",
          }}
        >
          <p>Esta acción no podrá deshacerse</p>
        </Modal.Body>

        <Modal.Footer style={{ borderTop: "none" }}>
          <Button
            variant="success"
            onClick={handleConfirmSaveChanges}
            style={{ backgroundColor: "#1A4756", color: "#fff" }}
          >
            Modificar
          </Button>
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            style={{ color: "#1A4756", backgroundColor: "#fff" }}
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserManagement;





