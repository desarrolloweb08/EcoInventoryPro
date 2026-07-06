package pe.edu.utp.ecoinventorypro.service;

import java.util.List;
import pe.edu.utp.ecoinventorypro.dto.ProveedorRequest;
import pe.edu.utp.ecoinventorypro.dto.ProveedorResponse;

public interface ProveedorService {

    List<ProveedorResponse> listar();

    ProveedorResponse obtener(Long id);

    ProveedorResponse guardar(ProveedorRequest request);

    ProveedorResponse actualizar(Long id, ProveedorRequest request);

    void eliminar(Long id);
}