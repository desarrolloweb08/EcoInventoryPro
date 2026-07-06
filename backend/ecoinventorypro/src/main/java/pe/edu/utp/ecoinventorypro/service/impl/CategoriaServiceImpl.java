package pe.edu.utp.ecoinventorypro.service.impl;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pe.edu.utp.ecoinventorypro.dto.CategoriaRequest;
import pe.edu.utp.ecoinventorypro.dto.CategoriaResponse;
import pe.edu.utp.ecoinventorypro.entity.Categoria;
import pe.edu.utp.ecoinventorypro.exception.ResourceNotFoundException;
import pe.edu.utp.ecoinventorypro.repository.CategoriaRepository;
import pe.edu.utp.ecoinventorypro.service.CategoriaService;

@Service
public class CategoriaServiceImpl implements CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Override
    public List<CategoriaResponse> listar() {
        return categoriaRepository.findAll()
                .stream()
                .map(c -> new CategoriaResponse(
                        c.getId(),
                        c.getNombre(),
                        c.getDescripcion()))
                .collect(Collectors.toList());
    }

    @Override
    public CategoriaResponse obtener(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));

        return new CategoriaResponse(
                categoria.getId(),
                categoria.getNombre(),
                categoria.getDescripcion());
    }

    @Override
    public CategoriaResponse guardar(CategoriaRequest request) {
        if (categoriaRepository.existsByNombre(request.getNombre())) {
            throw new RuntimeException("Ya existe una categoría con ese nombre");
        }

        Categoria categoria = new Categoria();
        categoria.setNombre(request.getNombre());
        categoria.setDescripcion(request.getDescripcion());
        categoria.setEstado(true);  // <--- AGREGAR ESTA LÍNEA

        Categoria guardado = categoriaRepository.save(categoria);

        return new CategoriaResponse(
                guardado.getId(),
                guardado.getNombre(),
                guardado.getDescripcion());
    }

    @Override
    public CategoriaResponse actualizar(Long id, CategoriaRequest request) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));

        if (!categoria.getNombre().equals(request.getNombre())
                && categoriaRepository.existsByNombre(request.getNombre())) {
            throw new RuntimeException("Ya existe una categoría con ese nombre");
        }

        categoria.setNombre(request.getNombre());
        categoria.setDescripcion(request.getDescripcion());

        Categoria actualizado = categoriaRepository.save(categoria);

        return new CategoriaResponse(
                actualizado.getId(),
                actualizado.getNombre(),
                actualizado.getDescripcion());
    }

    @Override
    public void eliminar(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));
        categoriaRepository.delete(categoria);
    }
}