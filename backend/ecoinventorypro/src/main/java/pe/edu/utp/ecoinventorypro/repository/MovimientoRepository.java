package pe.edu.utp.ecoinventorypro.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import pe.edu.utp.ecoinventorypro.entity.Movimiento;

public interface MovimientoRepository extends JpaRepository<Movimiento, Long>{
List<Movimiento> findAllByOrderByFechaMovimientoDesc();
List<Movimiento> findByProductoIdOrderByFechaMovimientoDesc(Long productoId);
List<Movimiento> findByTipoMovimientoIdOrderByFechaMovimientoDesc(Long tipoMovimientoId);
}