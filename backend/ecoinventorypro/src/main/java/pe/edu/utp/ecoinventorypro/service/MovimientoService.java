package pe.edu.utp.ecoinventorypro.service;

import java.util.List;
import pe.edu.utp.ecoinventorypro.dto.MovimientoRequest;
import pe.edu.utp.ecoinventorypro.dto.MovimientoResponse;

public interface MovimientoService {

    List<MovimientoResponse> listar();

    MovimientoResponse obtener(Long id);

    MovimientoResponse registrar(MovimientoRequest request, Long usuarioId);

    List<MovimientoResponse> listarPorProducto(Long productoId);

    List<MovimientoResponse> listarPorTipo(Long tipoMovimientoId);
}