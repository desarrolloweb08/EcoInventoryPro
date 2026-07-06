package pe.edu.utp.ecoinventorypro.controller;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pe.edu.utp.ecoinventorypro.dto.ApiResponse;
import pe.edu.utp.ecoinventorypro.dto.ProductoRequest;
import pe.edu.utp.ecoinventorypro.dto.ProductoResponse;
import pe.edu.utp.ecoinventorypro.service.ProductoService;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    public ApiResponse<List<ProductoResponse>> listar() {
        return new ApiResponse<>(
                true,
                "Productos obtenidos correctamente",
                productoService.listar());
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductoResponse> obtener(@PathVariable Long id) {
        return new ApiResponse<>(
                true,
                "Producto encontrado",
                productoService.obtener(id));
    }

    @PostMapping
    public ApiResponse<ProductoResponse> guardar(@Valid @RequestBody ProductoRequest request) {
        return new ApiResponse<>(
                true,
                "Producto registrado correctamente",
                productoService.guardar(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<ProductoResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ProductoRequest request) {
        return new ApiResponse<>(
                true,
                "Producto actualizado correctamente",
                productoService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Object> eliminar(@PathVariable Long id) {
        productoService.eliminar(id);
        return new ApiResponse<>(
                true,
                "Producto eliminado correctamente",
                null);
    }
}