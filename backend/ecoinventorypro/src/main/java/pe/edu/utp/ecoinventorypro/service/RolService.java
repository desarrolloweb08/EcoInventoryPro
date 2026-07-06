package pe.edu.utp.ecoinventorypro.service;

import java.util.List;
import pe.edu.utp.ecoinventorypro.dto.RolRequest;
import pe.edu.utp.ecoinventorypro.dto.RolResponse;

public interface RolService {

    List<RolResponse> listarTodos();

    RolResponse obtenerPorId(Long id);

    RolResponse guardar(RolRequest request);

    RolResponse actualizar(Long id, RolRequest request);

    void eliminar(Long id);

}