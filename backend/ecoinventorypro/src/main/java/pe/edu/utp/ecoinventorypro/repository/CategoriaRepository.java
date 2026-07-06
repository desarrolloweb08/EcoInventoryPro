package pe.edu.utp.ecoinventorypro.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.utp.ecoinventorypro.entity.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long>{
    boolean existsByNombre(String nombre);  // <--- AGREGA ESTA LÍNEA
}