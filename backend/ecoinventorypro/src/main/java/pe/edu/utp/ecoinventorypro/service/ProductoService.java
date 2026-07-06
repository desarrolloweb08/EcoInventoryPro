package pe.edu.utp.ecoinventorypro.service;

import java.util.List;
import pe.edu.utp.ecoinventorypro.dto.ProductoRequest;
import pe.edu.utp.ecoinventorypro.dto.ProductoResponse;

public interface ProductoService {

    List<ProductoResponse> listar();

    ProductoResponse obtener(Long id);

    ProductoResponse guardar(ProductoRequest request);

    ProductoResponse actualizar(Long id, ProductoRequest request);

    void eliminar(Long id);
}