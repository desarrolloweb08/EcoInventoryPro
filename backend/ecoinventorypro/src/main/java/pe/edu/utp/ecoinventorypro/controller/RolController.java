package pe.edu.utp.ecoinventorypro.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pe.edu.utp.ecoinventorypro.dto.ApiResponse;
import pe.edu.utp.ecoinventorypro.dto.RolRequest;
import pe.edu.utp.ecoinventorypro.dto.RolResponse;
import pe.edu.utp.ecoinventorypro.service.RolService;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RolController {

    @Autowired
    private RolService rolService;

    @GetMapping
    public ApiResponse<List<RolResponse>> listarRoles() {

        return new ApiResponse<>(
                true,
                "Roles obtenidos correctamente",
                rolService.listarTodos());

    }

    @GetMapping("/{id}")
    public ApiResponse<RolResponse> obtener(@PathVariable Long id) {

        return new ApiResponse<>(
                true,
                "Rol encontrado",
                rolService.obtenerPorId(id));

    }

    @PostMapping
    public ApiResponse<RolResponse> guardar(
            @Valid @RequestBody RolRequest request) {

        return new ApiResponse<>(
                true,
                "Rol registrado correctamente",
                rolService.guardar(request));

    }

    @PutMapping("/{id}")
    public ApiResponse<RolResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody RolRequest request) {

        return new ApiResponse<>(
                true,
                "Rol actualizado correctamente",
                rolService.actualizar(id, request));

    }

    @DeleteMapping("/{id}")
    public ApiResponse<Object> eliminar(
            @PathVariable Long id) {

        rolService.eliminar(id);

        return new ApiResponse<>(
                true,
                "Rol eliminado correctamente",
                null);

    }

}