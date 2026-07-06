package pe.edu.utp.ecoinventorypro.controller;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pe.edu.utp.ecoinventorypro.dto.ApiResponse;
import pe.edu.utp.ecoinventorypro.dto.ProveedorRequest;
import pe.edu.utp.ecoinventorypro.dto.ProveedorResponse;
import pe.edu.utp.ecoinventorypro.service.ProveedorService;

@RestController
@RequestMapping("/api/proveedores")
public class ProveedorController {

    @Autowired
    private ProveedorService proveedorService;

    @GetMapping
    public ApiResponse<List<ProveedorResponse>> listar() {
        return new ApiResponse<>(
                true,
                "Proveedores obtenidos correctamente",
                proveedorService.listar());
    }

    @GetMapping("/{id}")
    public ApiResponse<ProveedorResponse> obtener(@PathVariable Long id) {
        return new ApiResponse<>(
                true,
                "Proveedor encontrado",
                proveedorService.obtener(id));
    }

    @PostMapping
    public ApiResponse<ProveedorResponse> guardar(@Valid @RequestBody ProveedorRequest request) {
        return new ApiResponse<>(
                true,
                "Proveedor registrado correctamente",
                proveedorService.guardar(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<ProveedorResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ProveedorRequest request) {
        return new ApiResponse<>(
                true,
                "Proveedor actualizado correctamente",
                proveedorService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Object> eliminar(@PathVariable Long id) {
        proveedorService.eliminar(id);
        return new ApiResponse<>(
                true,
                "Proveedor eliminado correctamente",
                null);
    }
}