package pe.edu.utp.ecoinventorypro.service;

import java.util.List;
import pe.edu.utp.ecoinventorypro.dto.UsuarioRequest;
import pe.edu.utp.ecoinventorypro.dto.UsuarioResponse;

public interface UsuarioService {

    List<UsuarioResponse> listar();

    UsuarioResponse obtener(Long id);

    UsuarioResponse guardar(UsuarioRequest request);

    UsuarioResponse actualizar(Long id, UsuarioRequest request);

    void eliminar(Long id);

}