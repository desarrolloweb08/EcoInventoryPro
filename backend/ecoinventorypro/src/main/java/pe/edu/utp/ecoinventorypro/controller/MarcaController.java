package pe.edu.utp.ecoinventorypro.controller;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pe.edu.utp.ecoinventorypro.dto.ApiResponse;
import pe.edu.utp.ecoinventorypro.dto.MarcaRequest;
import pe.edu.utp.ecoinventorypro.dto.MarcaResponse;
import pe.edu.utp.ecoinventorypro.service.MarcaService;

@RestController
@RequestMapping("/api/marcas")
public class MarcaController {

    @Autowired
    private MarcaService marcaService;

    @GetMapping
    public ApiResponse<List<MarcaResponse>> listar() {
        return new ApiResponse<>(
                true,
                "Marcas obtenidas correctamente",
                marcaService.listar());
    }

    @GetMapping("/{id}")
    public ApiResponse<MarcaResponse> obtener(@PathVariable Long id) {
        return new ApiResponse<>(
                true,
                "Marca encontrada",
                marcaService.obtener(id));
    }

    @PostMapping
    public ApiResponse<MarcaResponse> guardar(@Valid @RequestBody MarcaRequest request) {
        return new ApiResponse<>(
                true,
                "Marca registrada correctamente",
                marcaService.guardar(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<MarcaResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody MarcaRequest request) {
        return new ApiResponse<>(
                true,
                "Marca actualizada correctamente",
                marcaService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Object> eliminar(@PathVariable Long id) {
        marcaService.eliminar(id);
        return new ApiResponse<>(
                true,
                "Marca eliminada correctamente",
                null);
    }
}