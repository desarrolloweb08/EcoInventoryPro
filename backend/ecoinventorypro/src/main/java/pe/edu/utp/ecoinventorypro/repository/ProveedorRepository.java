package pe.edu.utp.ecoinventorypro.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.utp.ecoinventorypro.entity.Proveedor;

public interface ProveedorRepository extends JpaRepository<Proveedor, Long>{
   boolean existsByRuc(String ruc);
   boolean existsByCorreo(String correo);
}