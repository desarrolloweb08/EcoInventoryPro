package pe.edu.utp.ecoinventorypro.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.utp.ecoinventorypro.dto.MovimientoRequest;
import pe.edu.utp.ecoinventorypro.dto.MovimientoResponse;
import pe.edu.utp.ecoinventorypro.entity.Movimiento;
import pe.edu.utp.ecoinventorypro.entity.Producto;
import pe.edu.utp.ecoinventorypro.entity.TipoMovimiento;
import pe.edu.utp.ecoinventorypro.entity.Usuario;
import pe.edu.utp.ecoinventorypro.exception.ResourceNotFoundException;
import pe.edu.utp.ecoinventorypro.repository.MovimientoRepository;
import pe.edu.utp.ecoinventorypro.repository.ProductoRepository;
import pe.edu.utp.ecoinventorypro.repository.TipoMovimientoRepository;
import pe.edu.utp.ecoinventorypro.repository.UsuarioRepository;
import pe.edu.utp.ecoinventorypro.service.MovimientoService;

@Service
public class MovimientoServiceImpl implements MovimientoService {

    @Autowired
    private MovimientoRepository movimientoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private TipoMovimientoRepository tipoMovimientoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public List<MovimientoResponse> listar() {
        return movimientoRepository.findAllByOrderByFechaMovimientoDesc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public MovimientoResponse obtener(Long id) {
        Movimiento movimiento = movimientoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movimiento no encontrado"));
        return convertToResponse(movimiento);
    }

    @Override
    @Transactional
    public MovimientoResponse registrar(MovimientoRequest request, Long usuarioId) {
        // Validar producto
        Producto producto = productoRepository.findById(request.getProductoId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

        // Validar tipo de movimiento
        TipoMovimiento tipoMovimiento = tipoMovimientoRepository.findById(request.getTipoMovimientoId())
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de movimiento no encontrado"));

        // Validar usuario
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // Validar stock para SALIDA (tipo 2)
        if (tipoMovimiento.getId() == 2) { // Suponiendo que SALIDA tiene id = 2
            if (producto.getStockActual() < request.getCantidad()) {
                throw new RuntimeException("Stock insuficiente. Stock actual: " + 
                        producto.getStockActual() + ", Cantidad solicitada: " + request.getCantidad());
            }
        }

        // Crear movimiento
        Movimiento movimiento = new Movimiento();
        movimiento.setProducto(producto);
        movimiento.setUsuario(usuario);
        movimiento.setTipoMovimiento(tipoMovimiento);
        movimiento.setCantidad(request.getCantidad());
        movimiento.setCostoUnitario(producto.getPrecioCompra());
        movimiento.setMotivo(request.getMotivo());
        movimiento.setObservacion(request.getObservacion());
         movimiento.setFechaMovimiento(LocalDateTime.now());  // <--- AGREGAR ESTA LÍNEA

        Movimiento guardado = movimientoRepository.save(movimiento);

        // Actualizar stock
        if (tipoMovimiento.getId() == 1) { // ENTRADA
            producto.setStockActual(producto.getStockActual() + request.getCantidad());
        } else if (tipoMovimiento.getId() == 2) { // SALIDA
            producto.setStockActual(producto.getStockActual() - request.getCantidad());
        }
        productoRepository.save(producto);

        return convertToResponse(guardado);
    }

    @Override
    public List<MovimientoResponse> listarPorProducto(Long productoId) {
        return movimientoRepository.findByProductoIdOrderByFechaMovimientoDesc(productoId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MovimientoResponse> listarPorTipo(Long tipoMovimientoId) {
        return movimientoRepository.findByTipoMovimientoIdOrderByFechaMovimientoDesc(tipoMovimientoId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private MovimientoResponse convertToResponse(Movimiento m) {
        MovimientoResponse response = new MovimientoResponse();
        response.setId(m.getId());
        response.setProductoNombre(m.getProducto().getNombre());
        response.setProductoCodigo(m.getProducto().getCodigo());
        response.setTipoMovimiento(m.getTipoMovimiento().getNombre());
        response.setCantidad(m.getCantidad());
        response.setCostoUnitario(m.getCostoUnitario());
        response.setMotivo(m.getMotivo());
        response.setObservacion(m.getObservacion());
        response.setUsuarioNombre(m.getUsuario().getNombres() + " " + m.getUsuario().getApellidos());
        response.setFechaMovimiento(m.getFechaMovimiento());
        return response;
    }
}