package pe.edu.utp.ecoinventorypro.controller;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pe.edu.utp.ecoinventorypro.dto.ApiResponse;
import pe.edu.utp.ecoinventorypro.dto.MovimientoRequest;
import pe.edu.utp.ecoinventorypro.dto.MovimientoResponse;
import pe.edu.utp.ecoinventorypro.service.MovimientoService;

@RestController
@RequestMapping("/api/movimientos")
public class MovimientoController {

    @Autowired
    private MovimientoService movimientoService;

    // Usuario temporal para pruebas (después se obtendrá del token JWT)
    private static final Long USUARIO_TEMP = 1L;

    @GetMapping
    public ApiResponse<List<MovimientoResponse>> listar() {
        return new ApiResponse<>(
                true,
                "Movimientos obtenidos correctamente",
                movimientoService.listar());
    }

    @GetMapping("/{id}")
    public ApiResponse<MovimientoResponse> obtener(@PathVariable Long id) {
        return new ApiResponse<>(
                true,
                "Movimiento encontrado",
                movimientoService.obtener(id));
    }

    @PostMapping
    public ApiResponse<MovimientoResponse> registrar(@Valid @RequestBody MovimientoRequest request) {
        return new ApiResponse<>(
                true,
                "Movimiento registrado correctamente",
                movimientoService.registrar(request, USUARIO_TEMP));
    }

    @GetMapping("/producto/{productoId}")
    public ApiResponse<List<MovimientoResponse>> listarPorProducto(@PathVariable Long productoId) {
        return new ApiResponse<>(
                true,
                "Movimientos del producto obtenidos correctamente",
                movimientoService.listarPorProducto(productoId));
    }

    @GetMapping("/tipo/{tipoMovimientoId}")
    public ApiResponse<List<MovimientoResponse>> listarPorTipo(@PathVariable Long tipoMovimientoId) {
        return new ApiResponse<>(
                true,
                "Movimientos por tipo obtenidos correctamente",
                movimientoService.listarPorTipo(tipoMovimientoId));
    }
}