package pe.edu.utp.ecoinventorypro.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.utp.ecoinventorypro.entity.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long>{
boolean existsByCodigo(String codigo);
}