package pe.edu.utp.ecoinventorypro.controller;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pe.edu.utp.ecoinventorypro.dto.ApiResponse;
import pe.edu.utp.ecoinventorypro.dto.UsuarioRequest;
import pe.edu.utp.ecoinventorypro.dto.UsuarioResponse;
import pe.edu.utp.ecoinventorypro.service.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ApiResponse<List<UsuarioResponse>> listar() {
        return new ApiResponse<>(
                true,
                "Usuarios obtenidos correctamente",
                usuarioService.listar());
    }

    @GetMapping("/{id}")
    public ApiResponse<UsuarioResponse> obtener(@PathVariable Long id) {
        return new ApiResponse<>(
                true,
                "Usuario encontrado",
                usuarioService.obtener(id));
    }

    @PostMapping
    public ApiResponse<UsuarioResponse> guardar(@Valid @RequestBody UsuarioRequest request) {
        return new ApiResponse<>(
                true,
                "Usuario registrado correctamente",
                usuarioService.guardar(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<UsuarioResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioRequest request) {
        return new ApiResponse<>(
                true,
                "Usuario actualizado correctamente",
                usuarioService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Object> eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return new ApiResponse<>(
                true,
                "Usuario eliminado correctamente",
                null);
    }
}