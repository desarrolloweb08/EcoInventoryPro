package pe.edu.utp.ecoinventorypro.controller;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pe.edu.utp.ecoinventorypro.dto.ApiResponse;
import pe.edu.utp.ecoinventorypro.dto.CategoriaRequest;
import pe.edu.utp.ecoinventorypro.dto.CategoriaResponse;
import pe.edu.utp.ecoinventorypro.service.CategoriaService;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping
    public ApiResponse<List<CategoriaResponse>> listar() {
        return new ApiResponse<>(
                true,
                "Categorías obtenidas correctamente",
                categoriaService.listar());
    }

    @GetMapping("/{id}")
    public ApiResponse<CategoriaResponse> obtener(@PathVariable Long id) {
        return new ApiResponse<>(
                true,
                "Categoría encontrada",
                categoriaService.obtener(id));
    }

    @PostMapping
    public ApiResponse<CategoriaResponse> guardar(@Valid @RequestBody CategoriaRequest request) {
        return new ApiResponse<>(
                true,
                "Categoría registrada correctamente",
                categoriaService.guardar(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<CategoriaResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody CategoriaRequest request) {
        return new ApiResponse<>(
                true,
                "Categoría actualizada correctamente",
                categoriaService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Object> eliminar(@PathVariable Long id) {
        categoriaService.eliminar(id);
        return new ApiResponse<>(
                true,
                "Categoría eliminada correctamente",
                null);
    }
}