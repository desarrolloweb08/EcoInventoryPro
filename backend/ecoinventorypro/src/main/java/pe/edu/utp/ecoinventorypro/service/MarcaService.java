package pe.edu.utp.ecoinventorypro.service;

import java.util.List;
import pe.edu.utp.ecoinventorypro.dto.MarcaRequest;
import pe.edu.utp.ecoinventorypro.dto.MarcaResponse;

public interface MarcaService {

    List<MarcaResponse> listar();

    MarcaResponse obtener(Long id);

    MarcaResponse guardar(MarcaRequest request);

    MarcaResponse actualizar(Long id, MarcaRequest request);

    void eliminar(Long id);
}