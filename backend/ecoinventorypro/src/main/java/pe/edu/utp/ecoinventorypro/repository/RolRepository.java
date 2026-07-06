package pe.edu.utp.ecoinventorypro.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.edu.utp.ecoinventorypro.entity.Rol;

@Repository
public interface RolRepository extends JpaRepository<Rol, Long> {
boolean existsByNombre(String nombre);
}