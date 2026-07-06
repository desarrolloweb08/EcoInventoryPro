package pe.edu.utp.ecoinventorypro.service.impl;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pe.edu.utp.ecoinventorypro.dto.ProductoRequest;
import pe.edu.utp.ecoinventorypro.dto.ProductoResponse;
import pe.edu.utp.ecoinventorypro.entity.Categoria;
import pe.edu.utp.ecoinventorypro.entity.Marca;
import pe.edu.utp.ecoinventorypro.entity.Producto;
import pe.edu.utp.ecoinventorypro.entity.Proveedor;
import pe.edu.utp.ecoinventorypro.exception.ResourceNotFoundException;
import pe.edu.utp.ecoinventorypro.repository.CategoriaRepository;
import pe.edu.utp.ecoinventorypro.repository.MarcaRepository;
import pe.edu.utp.ecoinventorypro.repository.ProductoRepository;
import pe.edu.utp.ecoinventorypro.repository.ProveedorRepository;
import pe.edu.utp.ecoinventorypro.service.ProductoService;

@Service
public class ProductoServiceImpl implements ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private MarcaRepository marcaRepository;

    @Autowired
    private ProveedorRepository proveedorRepository;

    @Override
    public List<ProductoResponse> listar() {
        return productoRepository.findAll()
                .stream()
                .map(p -> new ProductoResponse(
                        p.getId(),
                        p.getCodigo(),
                        p.getNombre(),
                        p.getDescripcion(),
                        p.getPrecioCompra(),
                        p.getPrecioVenta(),
                        p.getStockActual(),
                        p.getStockMinimo(),
                        p.getCategoria().getNombre(),
                        p.getMarca().getNombre(),
                        p.getProveedor().getNombre()))
                .collect(Collectors.toList());
    }

    @Override
    public ProductoResponse obtener(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

        return new ProductoResponse(
                producto.getId(),
                producto.getCodigo(),
                producto.getNombre(),
                producto.getDescripcion(),
                producto.getPrecioCompra(),
                producto.getPrecioVenta(),
                producto.getStockActual(),
                producto.getStockMinimo(),
                producto.getCategoria().getNombre(),
                producto.getMarca().getNombre(),
                producto.getProveedor().getNombre());
    }

    @Override
public ProductoResponse guardar(ProductoRequest request) {
    if (productoRepository.existsByCodigo(request.getCodigo())) {
        throw new RuntimeException("Ya existe un producto con el código: " + request.getCodigo());
    }

    Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
            .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));

    Marca marca = marcaRepository.findById(request.getMarcaId())
            .orElseThrow(() -> new ResourceNotFoundException("Marca no encontrada"));

    Proveedor proveedor = proveedorRepository.findById(request.getProveedorId())
            .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado"));

    Producto producto = new Producto();
    producto.setCodigo(request.getCodigo());
    producto.setNombre(request.getNombre());
    producto.setDescripcion(request.getDescripcion());
    producto.setPrecioCompra(request.getPrecioCompra());
    producto.setPrecioVenta(request.getPrecioVenta());
    producto.setStockMinimo(request.getStockMinimo() != null ? request.getStockMinimo() : 0);
    producto.setStockActual(0);  // <--- AGREGAR ESTA LÍNEA (IMPORTANTE)
    producto.setEstado(true);    // <--- ESTADO ACTIVO
    producto.setCategoria(categoria);
    producto.setMarca(marca);
    producto.setProveedor(proveedor);

    Producto guardado = productoRepository.save(producto);

    return new ProductoResponse(
            guardado.getId(),
            guardado.getCodigo(),
            guardado.getNombre(),
            guardado.getDescripcion(),
            guardado.getPrecioCompra(),
            guardado.getPrecioVenta(),
            guardado.getStockActual(),
            guardado.getStockMinimo(),
            guardado.getCategoria().getNombre(),
            guardado.getMarca().getNombre(),
            guardado.getProveedor().getNombre());
}

    @Override
    public ProductoResponse actualizar(Long id, ProductoRequest request) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

        if (!producto.getCodigo().equals(request.getCodigo())
                && productoRepository.existsByCodigo(request.getCodigo())) {
            throw new RuntimeException("Ya existe un producto con el código: " + request.getCodigo());
        }

        Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));

        Marca marca = marcaRepository.findById(request.getMarcaId())
                .orElseThrow(() -> new ResourceNotFoundException("Marca no encontrada"));

        Proveedor proveedor = proveedorRepository.findById(request.getProveedorId())
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado"));

        producto.setCodigo(request.getCodigo());
        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecioCompra(request.getPrecioCompra());
        producto.setPrecioVenta(request.getPrecioVenta());
        producto.setStockMinimo(request.getStockMinimo() != null ? request.getStockMinimo() : 0);
        producto.setCategoria(categoria);
        producto.setMarca(marca);
        producto.setProveedor(proveedor);

        Producto actualizado = productoRepository.save(producto);

        return new ProductoResponse(
                actualizado.getId(),
                actualizado.getCodigo(),
                actualizado.getNombre(),
                actualizado.getDescripcion(),
                actualizado.getPrecioCompra(),
                actualizado.getPrecioVenta(),
                actualizado.getStockActual(),
                actualizado.getStockMinimo(),
                actualizado.getCategoria().getNombre(),
                actualizado.getMarca().getNombre(),
                actualizado.getProveedor().getNombre());
    }

    @Override
    public void eliminar(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
        productoRepository.delete(producto);
    }
}