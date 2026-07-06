package pe.edu.utp.ecoinventorypro.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.utp.ecoinventorypro.entity.Marca;

public interface MarcaRepository extends JpaRepository<Marca, Long>{
    boolean existsByNombre(String nombre);
}