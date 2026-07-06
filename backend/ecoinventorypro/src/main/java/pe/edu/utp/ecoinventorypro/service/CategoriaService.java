package pe.edu.utp.ecoinventorypro.service;

import java.util.List;
import pe.edu.utp.ecoinventorypro.dto.CategoriaRequest;
import pe.edu.utp.ecoinventorypro.dto.CategoriaResponse;

public interface CategoriaService {

    List<CategoriaResponse> listar();

    CategoriaResponse obtener(Long id);

    CategoriaResponse guardar(CategoriaRequest request);

    CategoriaResponse actualizar(Long id, CategoriaRequest request);

    void eliminar(Long id);

}